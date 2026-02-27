import axios from 'axios';
import * as crypto from 'node:crypto';

const hmacSecret = process.env.HMAC_SECRET!;
const serverUrl = `http://${process.env.HOST!}:${process.env.PORT!}/api/v1/events`;
const testCase01Count = 100;

function createSignature(body: object): string {
  return crypto
    .createHmac('sha256', hmacSecret)
    .update(JSON.stringify(body))
    .digest('hex');
}

async function testCase01(): Promise<void> {
  console.log(
    `==========> TEST CASE 01 <==========\nthis test will send ${testCase01Count} requests into server in order to create shipment record`,
  );

  console.log('Generating events...');

  let startsAt = Date.now();

  const events = Array.from({ length: testCase01Count }, () => {
    const body = {
      id: crypto.randomUUID(),
      type: 'CREATE_SHIPMENT',
      timestamp: '2026-02-27T01:45:07Z',
      payload: {
        orderId: '4f654ee5-8eec-4860-a685-63e86226c038',
        status: 'ORDERED',
        courier: 'Aramex',
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
    `==========> RESULT 01 <==========\nLess than 150ms: ${lessThan150}\nGreater than 150ms: ${greaterThan150}\nFailed: ${failed}\nSub total: ${lessThan150 + greaterThan150 + failed}`,
  );
}

void testCase01();
