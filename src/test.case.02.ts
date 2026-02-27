import axios from 'axios';
import mongoose from 'mongoose';
import * as crypto from 'node:crypto';

const uri = process.env.MONGODB_URI!;

const hmacSecret = process.env.HMAC_SECRET!;
const serverUrl = `http://${process.env.HOST!}:${process.env.PORT!}/api/v1/events`;
const testCase01Count = 100;

function createSignature(body: object): string {
  return crypto
    .createHmac('sha256', hmacSecret)
    .update(JSON.stringify(body))
    .digest('hex');
}

const idList: string[] = [];
const statusList = [
  'ORDERED',
  'SHIPPING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURN_REQUESTED',
];

function getRandomId(): string {
  const index = Math.floor(Math.random() * (idList.length - 1));

  return idList[index];
}

function getRandomStatus(): string {
  const index = Math.floor(Math.random() * (statusList.length - 1));

  return statusList[index];
}

async function testCase01(): Promise<void> {
  console.log(
    `==========> TEST CASE 02 <==========\nthis test will send ${testCase01Count} requests into server in order to update shipment status`,
  );

  const fetched = await fetchIdList();
  idList.push(...fetched);

  console.log('Generating events...');

  let startsAt = Date.now();

  const events = Array.from({ length: testCase01Count }, () => {
    const body = {
      id: crypto.randomUUID(),
      type: 'UPDATE_SHIPMENT_STATUS',
      timestamp: '2026-02-27T01:45:07Z',
      payload: {
        shipmentId: getRandomId(),
        status: getRandomStatus(),
      },
    };

    const signature = createSignature(body);

    return { body, signature };
  });

  let duration = Date.now() - startsAt;

  console.log(
    `Events generated in ${duration}ms - ${Math.floor(duration / 1000)}s`,
  );

  console.log('Sending events...');

  startsAt = Date.now();

  const results = await Promise.all(
    events.map(async (event) => {
      try {
        const { body, signature } = event;
        const startsAt = Date.now();
        await axios.post(serverUrl, body, {
          headers: {
            'Content-Type': 'application/json',
            'x-signature': signature,
          },
        });
        const duration = Date.now() - startsAt;

        return {
          success: true,
          accepted: duration < 150,
        };
      } catch {
        return {
          success: false,
          accepted: false,
        };
      }
    }),
  );

  duration = Date.now() - startsAt;

  console.log(`Events sent in ${duration}ms - ${Math.floor(duration / 1000)}s`);

  let lessThan150 = 0,
    greaterThan150 = 0,
    failed = 0;

  for (const result of results) {
    const { success, accepted } = result;

    if (success && accepted) {
      lessThan150++;
    } else if (success && !accepted) {
      greaterThan150++;
    } else if (!success) {
      failed++;
    }
  }

  console.log(
    `==========> RESULT 02 <==========\nLess than 150ms: ${lessThan150}\nGreater than 150ms: ${greaterThan150}\nFailed: ${failed}\nSub total: ${lessThan150 + greaterThan150 + failed}`,
  );
}

async function fetchIdList() {
  try {
    await mongoose.connect(uri);

    const MyModel = mongoose.model(
      'Shipment',
      new mongoose.Schema({}),
      'shipmententities',
    );

    const docs = await MyModel.find({}).select('_id').lean();

    const idList = docs.map((doc) => String(doc._id));

    return idList;
  } catch {
    return [];
  } finally {
    await mongoose.disconnect();
  }
}

void testCase01();
