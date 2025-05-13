import { atom } from 'recoil';


export const persistAtom = (key, defaultValue) => {
    const isKeyExist = localStorage.getItem(key);
    if(isKeyExist != "undefined" && isKeyExist) {
  const savedValue = JSON.parse(localStorage.getItem(key));

  return atom({
    key,
    default: savedValue !== null ? savedValue : defaultValue,
    effects_UNSTABLE: [
      ({ onSet }) => {
        onSet(newValue => {
          localStorage.setItem(key, JSON.stringify(newValue));
        });
      },
    ],
  });}
  else return atom({
    key,
    default: defaultValue,
    effects_UNSTABLE: [
      ({ onSet }) => {
        onSet(newValue => {
          localStorage.setItem(key, JSON.stringify(newValue));
        });
      },
    ],
  });
};