type KeyValuePairs = { [key: string]: any };

const chromeStorageDisabled = (): boolean => {
   const isDisabled = typeof chrome === 'undefined' || chrome.storage === undefined;
   if (isDisabled) console.info('chrome storage not available:\nUsing localstorage instead');
   return isDisabled;
}

export const set = async (values: KeyValuePairs) => new Promise<void>((resolve, reject) => {
   if (chromeStorageDisabled()) {
      Object.entries(values).forEach(([key, value]) => {
         localStorage.setItem(key, JSON.stringify(value));
      });
      resolve();
   }

   chrome.storage.sync.set(values, () => {
      if (chrome.runtime.lastError) {
         reject(chrome.runtime.lastError);
      } else {
         resolve();
      }
   });
});

export const get = async (...keys: string[]) => new Promise<KeyValuePairs>((resolve, reject) => {
   if (chromeStorageDisabled()) {
      const values: KeyValuePairs = {};
      keys.forEach(key => {
         values[key] = JSON.parse(localStorage.getItem(key) || 'null');
      });
      resolve(values);
   }

   chrome.storage.sync.get(keys, (values) => {
      if (chrome.runtime.lastError) {
         reject(chrome.runtime.lastError);
      } else {
         resolve(values);
      }
   });
});