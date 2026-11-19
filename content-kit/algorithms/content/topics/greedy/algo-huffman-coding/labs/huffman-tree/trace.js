function trace(input) {
    const nodes=input.frequencies.map((weight,id)=>({id,value:weight}));
    const weights=input.frequencies.slice(),left={},right={},heap=[],steps=[];
    const less=(a,b)=>weights[a]<weights[b]||(weights[a]===weights[b]&&a<b);
    function push(id) {
        let i=heap.length; heap.push(id);
        while(i>0&&less(id,heap[Math.floor((i-1)/2)])) {
            heap[i]=heap[Math.floor((i-1)/2)]; i=Math.floor((i-1)/2);
        }
        heap[i]=id;
    }
    function pop() {
        const result=heap[0],last=heap.pop(); let i=0;
        if(heap.length) {
            while(2*i+1<heap.length) {
                let child=2*i+1;
                if(child+1<heap.length&&less(heap[child+1],heap[child])) child++;
                if(!less(heap[child],last)) break;
                heap[i]=heap[child]; i=child;
            }
            heap[i]=last;
        }
        return result;
    }
    for(let i=0;i<nodes.length;i++) push(i);
    steps.push({op:'list',name:'heap',items:heap.slice(),line:1,note:{en:'Heap entries are node IDs ordered by weight, then ID.'}});
    while(heap.length>1) {
        const l=pop(),r=pop(),id=weights.length;
        weights.push(weights[l]+weights[r]); left[id]=l; right[id]=r;
        steps.push({op:'create',id,value:weights[id],line:4,note:{en:`Merge ${weights[l]} and ${weights[r]} because they are the two smallest weights.`,bn:'সবচেয়ে ছোট দুই ওজন জোড়া দিয়ে নতুন নোড বানাও।'}});
        steps.push({op:'set-child',parent:id,side:'left',child:l,line:5,note:{en:'The first minimum becomes the zero-bit branch.'}});
        steps.push({op:'set-child',parent:id,side:'right',child:r,line:5,note:{en:'The second minimum becomes the one-bit branch.'}});
        push(id);
        steps.push({op:'list',name:'heap',items:heap.slice(),line:5,note:{en:'The merged subtree competes with all remaining weights.'}});
    }
    const root=pop(),codes=[]; let bits=0;
    function visit(id,path) {
        if(left[id]===undefined) {
            const word=path||'0'; bits+=weights[id]*word.length;
            codes.push(`${String.fromCharCode(65+id)}: ${word}`); return;
        }
        visit(left[id],path+'0'); visit(right[id],path+'1');
    }
    visit(root,'');
    steps.push({op:'set-root',id:root,line:6,note:{en:'All symbols now belong to one prefix-code tree.',bn:'এখন সব সিম্বল একই prefix-code ট্রিতে আছে।'}});
    steps.push({op:'list',name:'codes',items:codes,line:6,note:{en:'Root-to-leaf bits identify symbols without separators.'}});
    steps.push({op:'done',line:7,vars:{bits},note:{en:`The encoded message uses ${bits} bits, excluding the codebook.`,bn:`কোডবুক বাদে বার্তায় ${bits} বিট লাগবে।`}});
    return {init:{nodes,left:{},right:{},root:null},steps};
}
