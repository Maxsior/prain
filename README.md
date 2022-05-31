# Prain

Tiny library to transform sequential function calls to method chaining.

# Use cases

Use this library if you have many **async methods** and use it **results one by one**
or if asynchronous and synchronous methods are **interleaved** and you don't want care about it.

Let's start with example.
```ts
const student = await StudentFactory.createStudentFromRemote(url, uid);
const chat = await student.getChat();
const message = await chat.createMessage();
await message.getFileUploader.upload(studingMaterialPath);
const success = await message.send();
```

We can write it as a chain using **prain**.
```ts
import _p from 'prain';

const success = await _p(StudentFactory)
  .createStudentFromRemote(url, uid)
  .getChat()
  .createMessage()
  .fileUploader // Note: syncronous access
  .upload(studingMaterialPath)
  .send();
```

**Prain** awaits all promises in the chain, no matter where they are – in properties, functions, methods.

```ts
import _p from 'prain';

const p = Promise.resolve({
  async foo() {
    return {
      promiseField: Promise.resolve({
        bar: 'resolved',
      }),
    };
  },
});

await _p(p)
  .foo()
  .promiseField
  .bar; // 'resolved'
```

See [tests](src/test.ts) for more examples and use cases.

Made with love ❤️ and peace 🕊️.
