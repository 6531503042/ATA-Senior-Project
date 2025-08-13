// bun-polyfills.ts
if (typeof globalThis.TextEncoderStream === "undefined") {
    console.warn("Polyfilling TextEncoderStream for Bun...");
    // Stub minimal class to avoid build crash — this won't do real encoding
    class FakeTextEncoderStream {
      readable = new ReadableStream();
      writable = new WritableStream();
    }
    globalThis.TextEncoderStream = FakeTextEncoderStream as any;
  }
  