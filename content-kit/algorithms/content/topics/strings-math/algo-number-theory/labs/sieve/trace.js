function trace(input) {
    const n = input.n, composite = Array(n+1).fill(0), steps = [];
    for (let k = 0; k <= Math.min(1,n); k++) {
        composite[k] = 1;
        steps.push({op:'set',i:k,value:1,line:1,note:{en:`${k} is not prime, so mark it before crossing off multiples.`,bn:`${k} প্রাইম নয়, তাই গুণিতক কাটার আগেই চিহ্ন দাও।`}});
    }
    for (let p = 2; p <= Math.floor(n/p); p++) {
        steps.push({op:'pointer',name:'p',target:p,line:2,vars:{p},
            note:{en:composite[p] ? 'This candidate is already composite; its multiples need no new prime pass.' : 'An unmarked candidate is prime; start its pass at p squared.'}});
        if (!composite[p]) {
            for (let multiple = p*p; multiple <= n; multiple += p) {
                composite[multiple] = 1;
                steps.push({op:'set',i:multiple,value:1,line:5,vars:{multiple},note:{en:`${multiple} is a multiple of ${p}, so it is composite.`,bn:`${multiple} হলো ${p}-এর গুণিতক, তাই কম্পোজিট।`}});
            }
        }
    }
    const primes = [];
    for (let k = 2; k <= n; k++) {
        if (!composite[k]) {
            primes.push(k);
            steps.push({op:'mark',targets:[k],tone:'found',line:6,note:{en:`${k} survived every possible smaller prime factor, so it is prime.`,bn:`ছোট প্রাইম দিয়ে ${k} কাটা যায়নি, তাই এটা প্রাইম।`}});
        }
    }
    steps.push({op:'list',name:'primes',items:primes,line:6,note:{en:'The unmarked indices at least two are exactly the primes.'}});
    steps.push({op:'done',vars:{count:primes.length},note:{en:`Found ${primes.length} prime(s) through ${n}.`,bn:`${n} পর্যন্ত ${primes.length}টা প্রাইম পাওয়া গেছে।`}});
    return {init:{array:Array(n+1).fill(0)},steps};
}
