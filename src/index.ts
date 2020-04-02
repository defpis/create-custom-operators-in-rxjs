import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function MyOperator<T>(callback: (v: T) => T = (v: T): T => v) {
  // 必须返回函数以嵌套调用
  // 可以在已有操作符上拓展，例如
  // function filterNil() {
  //   return filter((value) => value !== undefined && value !== null);
  // }
  return (source: Observable<T>): Observable<T> => {
    // 归并过程将source替换为新建Observable对象
    // 可以在已有操作符上拓展，例如
    // function filterNil() {
    //   return function <T>(source: Observable<T>) {
    //     return source.pipe(
    //       filter((value) => value !== undefined && value !== null),
    //     );
    //   };
    // }
    return new Observable((subscriber) => {
      return source.subscribe({
        next(value: T) {
          subscriber.next(callback(value));
        },
        error(error) {
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });
    });
  };
}

interval(1000)
  .pipe(
    // MyOperator is same as map
    MyOperator((v: number) => v + 1),
    map((v: number) => v + 1),
  )
  .subscribe((v: number) => console.log(v));
