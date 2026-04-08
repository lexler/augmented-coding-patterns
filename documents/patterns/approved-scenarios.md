---
authors: [ivett_ordog]
alternative_titles: ["Approved Fixtures"]
---

# Approved Scenarios

## Problem
Generating both tests and code with the AI and not checking is risky, but the AI is also prone to generating lots of tests quickly. Reviewing many AI-generated tests quickly becomes impractical, especially when assertions are complex.

## Pattern
Design tests around approval files that combine input and expected output in a domain-specific easy-to-validate format. This is a special case of the Constrained Tests pattern.

Validate the test execution logic once. After that, adding new test cases only requires reviewing fixtures.

Structure each approval file to contain:
- Input data (context, parameters, state)
- Expected output (results, side effects, API calls)
- Format adapted to your problem domain for easy scanning

The test runner reads fixtures, executes code, and regenerates approval files. Validation becomes a simple diff review.

This pattern works best for problems that have an intuitive visual representation that is straightforward to check, but can also be used for checking call sequences.

## Example

The pattern adapts to different domains:

**Testing a multi-step process with external service calls:**

Create fixtures like `checkout-with-discount.approved.md`:
```markdown
## Input
User: premium_member
Cart: [{product_id: "laptop-123", quantity: 1}, {product_id: "mouse-456", quantity: 1}]
Discount code: SAVE20

## Service Calls
POST /inventory/reserve
  {"items": [{product_id: "laptop-123", quantity: 1}, {product_id: "mouse-456", quantity: 1}]}
Response: 200 {"reservation_id": "res_789"}

GET /pricing/calculate
  {"items": [{product_id: "laptop-123", quantity: 1}, {product_id: "mouse-456", quantity: 1}], "user": "premium_member"}
Response: 200 {"subtotal": 1250, "discount": 250, "total": 1000}

POST /payment/process
  {"amount": 1000, "reservation_id": "res_789"}
Response: 200 {"transaction_id": "txn_abc"}

## Output
Order: confirmed
Total: $1000
Email sent: order_confirmation
```

Single test reads all `.approved.md` files, executes flows, regenerates files with actual results. Review is scanning markdown diffs, not reading assertion code.

**Testing visual algorithms:**

Create fixtures like `game-of-life-glider.approved.md`:
```markdown
## Input
......
..#...
...#..
.###..
......

## Result
......
......
.#.#..
..##..
..#...
```

Test reads all game-of-life fixtures, computes next generation, verifies output matches. Adding new test cases is drawing ASCII patterns - trivially easy to validate correctness by eye.

**Testing refactorings:**

Create fixture pairs like `inline-variable.input.ts` and `inline-variable.approved.ts`:

This example uses two separate files. One for the input and one for the expected output. The header contains the command that generates the approved output.

Input file:
```typescript
/**
 * @description Inline variable with multiple usages
 * @command refakts inline-variable "[{{CURRENT_FILE}} 8:18-8:21]"
 */

function processData(x: number, y: number): number {
    const sum = x + y;
    const result = sum * 2 + sum;
    return result;
}
```

Expected output file:
```typescript
/**
 * @description Inline variable with multiple usages
 * @command refakts inline-variable "[{{CURRENT_FILE}} 8:18-8:21]"
 */

function processData(x: number, y: number): number {
  const result = (x + y) * 2 + (x + y);
  return result;
}
```

## Note

This pattern has similarities to Gherkin but better adapts to the specific domain, making the extra indirection worthwhile.
