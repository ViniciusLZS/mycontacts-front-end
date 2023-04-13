export default function delay(ms = 1000) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => resolve(), ms);
    } catch (error) {
      reject();
    }
  });
}
