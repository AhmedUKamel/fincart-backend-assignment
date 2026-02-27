# FinCart Backend Assignment

**Solution for Senior Backend Engineer role assignment at FinCart Company**

**Steps to run**

```bash

docker compose up -d

pnpm install

nest start -w

pnpm run test01

pnpm run test02

```

**Duration**: From fist to last commit

**AI Usage**:

- Search for syntax of HMAC signature
- Seach for bullmq queue and worker syntax

**Notes**:

- The project is coded 100% by me, no AI Agent used either in this task or daily work, I prefer coding rather that prompting.
- Routing shipments and dead letter queue logic are ignore duo to high time consuption in order to make this code done
- This task is a simple version of one challenge I already faced while building microservices system in SkyGate, there was a service works as a orchestrator and receiving all events from different services in order to work as a brain and do the actual logic related to cloud platform
