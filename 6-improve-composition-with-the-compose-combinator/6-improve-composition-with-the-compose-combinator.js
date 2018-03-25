"use strict";

var _utils = require("../utils");

var doubleMap = ( _utils.map)(_utils.doubleTheNumber);
var isEvenFilter = ( _utils.filter)(_utils.evenOnly);
var isNot2Filter = ( _utils.filter)(function (val) {
  return val !== 2;
});
var pushReducer = function pushReducer(accumulation, value) {
  accumulation.push(value);
  return accumulation;
};
[1, 2, 3, 4].reduce(isNot2Filter(isEvenFilter(doubleMap(pushReducer))), []);

// compose(f,g)(x) === f(g(x));
//
// compose(isNot2Filter, isEvenFilter, doubleMap)(pushReducer) ===
// isNot2Filter(isEvenFilter(doubleMap(pushReducer)));

function double(x) {
    return 2*x
}

function triple(x) {
  return 3*x
}


function restOne(x) {
  return x-1
}

const fnName = /function\s(.*){/g

const getNameFromfn = (fn) => {
  // const arr= null/*  = fnName.exec(fn.toString()); */
  // // console.log(arr);
  return fn.nickName
    ? fn.nickName

    : fn.name
}

const compose = (...functions) =>
  functions.reduce(function mainReducer(accumulation, fn, i, initialArray) {
    const accName = getNameFromfn(accumulation)
    const fnName = getNameFromfn(fn)

    console.log('accumulation', accName );
    console.log('fn ' + fnName  );

    const rtnFnName = `fnRtn${i}`
    const rtnFn = `
        function ${rtnFnName}(...args){
          // thanks to closure
          return ${accName}(${fnName}(...args))
        }
    `

    console.log(rtnFn);

    let called = 0

       function shubby (arg) { 
        //  if(i=== initialArray.length -1){
          const my = shubby
          const idx = i 
          called +=1
          if(called === 1){

            // console.log(`*******************  ${i}: ${initialArray.length - i} : ${called}   ******************* `  );
            console.log(`*******************  ${rtnFnName} with ${arg}   ******************* `  );
            // console.log(rtnFnName + ' with ', arg );
            const mostInnerResult = fn(arg);
            console.log(`${fnName}(${arg}) : ${mostInnerResult} ` );
            if(idx===0){
              console.log(`*******************  ${accName} with ${mostInnerResult}   ******************* `  );
              // console.log(`${accName}(${mostInnerResult}) : ${accumulation(mostInnerResult)} ` );
            }
          }
        //  }
        
        return accumulation(fn(arg))
      }

      shubby.nickName= rtnFnName;
      // @ts-ignore
      shubby.description = rtnFn;

      return shubby
    }
    ,
    function identity (x) {
      return x
    }
  );


  const w= compose(double, restOne, triple)(5)
  console.log(w);
/* [1, 2, 3, 4].reduce(
  compose(isNot2Filter, isEvenFilter, doubleMap)(pushReducer),
  [],
); */
