function trace(input) {
    const n = input.n;
    const col = Array(n).fill(-1), steps = [];
    let count = 0, first = null;
    const say = (en, bn) => ({ en, bn });
    function search(row) {
        if (row === n) {
            count++;
            if (first === null) first = col.slice();
            steps.push({op:'note', line:2, vars:{count},
                note:say('Every row is filled safely, so count this board.', 'সব রোতে নিরাপদ কুইন আছে, তাই এই বোর্ডটা গুনো।')});
            return;
        }
        for (let c = 0; c < n; c++) {
            steps.push({op:'mark', targets:[[row,c]], tone:'considered', line:3,
                vars:{row,c,count}, note:say('Try this column; earlier queens determine whether it is safe.', 'এই কলামটা দেখো; আগের কুইনগুলো আক্রমণ করে কি না মিলিয়ে নাও।')});
            let safe = true;
            for (let prev = 0; prev < row; prev++) {
                const conflict = col[prev] === c || Math.abs(col[prev] - c) === row - prev;
                steps.push({op:'compare', a:[row,c], b:[prev,col[prev]], line:4,
                    note:say(conflict ? 'This earlier queen attacks the candidate; reject the square.' : 'Different column and diagonal gaps: this earlier queen does not attack.',
                        conflict ? 'আগের এই কুইনটা আক্রমণ করে, তাই ঘরটা বাদ দাও।' : 'কলাম আর ডায়াগোনালে সংঘাত নেই; এই কুইনটা আক্রমণ করে না।')});
                if (conflict) {safe = false; break;}
            }
            if (safe) {
                col[row] = c;
                steps.push({op:'set', r:row, c, value:'Q', line:5,
                    note:say('No earlier queen attacks, so place a queen and explore the next row.', 'আগের কোনো কুইন আক্রমণ করে না, তাই কুইন বসিয়ে পরের রোতে যাও।')});
                search(row + 1);
                col[row] = -1;
                steps.push({op:'set', r:row, c, value:'.', line:7,
                    note:say('Remove this choice before trying its sibling column.', 'পাশের কলাম দেখার আগে এই কুইনটা সরাও।')});
            }
            steps.push({op:'clear-marks', note:{en:'Clear the trial highlights before the next candidate.'}});
        }
    }
    search(0);
    if (first !== null) {
        for (let r = 0; r < n; r++) {
            steps.push({op:'set',r,c:first[r],value:'Q',
                note:say('Counting is complete; restore the saved first board for viewing.', 'গোনা শেষ; দেখার জন্য প্রথম বোর্ডটা ফিরিয়ে আনো।')});
        }
    }
    steps.push({op:'done',vars:{count},note:say(`${count} solution(s); reflections count separately.`, `${count}টা সমাধান; উল্টো দিকের বোর্ডও আলাদা করে গোনা হয়েছে।`)});
    return {init:{rows:n,cols:n,cells:Array.from({length:n},()=>Array(n).fill('.')),
        rowLabels:Array.from({length:n},(_,i)=>String(i)),colLabels:Array.from({length:n},(_,i)=>String(i))},steps};
}
