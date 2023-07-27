import { ClassProvider } from "@angular/core";
import { Search, SEARCH } from "./ShareableComponent";

export const getSearchServiceProvider = <T, C extends Search<T>>(clazz: new () => C): ClassProvider => ({
  provide: SEARCH,
  useClass: clazz,
});