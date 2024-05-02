import EventEmitter from "eventemitter3";
import { useEffect } from "react";

const emitter = new EventEmitter();

export const useSub = (event: any, callback: any) => {
  useEffect(() => {
    emitter.on(event, callback);
    return unsubscribe;
  }, []);

  const unsubscribe = () => {
    emitter.off(event, callback);
  };
  return unsubscribe;
};

export const usePub = () => {
  return (event: any, data: any) => {
    emitter.emit(event, data);
  };
};
