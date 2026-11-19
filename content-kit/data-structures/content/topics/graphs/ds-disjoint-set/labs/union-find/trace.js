function trace(input) {
    let pairs=input.graph===0?[[0,1],[0,2],[1,3],[1,4],[2,4],[3,5],[4,5]]:[];
    if(input.graph===1){for(let i=0;i<6;i++){pairs.push([i,i+1]);}}
    if(input.graph===3){for(let u=0;u<7;u++){for(let v=u+1;v<7;v++){pairs.push([u,v]);}}}
    if(input.graph===4){pairs=[[0,1],[2,3],[0,2],[4,5],[4,6],[0,4]];}
    const parent=[0,1,2,3,4,5,6], size=Array(7).fill(1), steps=[];
    let components=7;
    const add=(op,fields,line,en,bn)=>steps.push({op,...fields,line,note:{en,bn}});
    function find(u){
        let root=u;
        while(parent[root]!==root){
            add('pointer',{name:'root',target:root},2,'Follow parent links until a self-parent root is reached.','নিজের প্যারেন্ট নিজে এমন রুট পর্যন্ত লিংক ধরে যাও।');
            root=parent[root];
        }
        add('pointer',{name:'root',target:root},2,'This self-parent index is the representative.','এই ইনডেক্স নিজের প্যারেন্ট নিজে, তাই এটাই রুট।');
        while(parent[u]!==u){
            const next=parent[u]; parent[u]=root;
            add('set',{i:u,value:root},3,'Redirect this path link to the existing root; membership stays the same.','একই রুটে সরাসরি লিংক দাও, গ্রুপ বদলাবে না।');
            u=next;
        }
        return root;
    }
    add('list',{name:'size',items:size.slice()},1,'Make seven singleton sets of size one.','শুরুতে সাতটা আলাদা সেট, প্রতিটার সাইজ এক।');
    for(const [u,v] of pairs){
        add('note',{vars:{u,v}},2,'Find representatives before deciding whether an edge merges sets.','এজে দুই সেট জুড়বে কি না বুঝতে আগে রুট বের করো।');
        let a=find(u), b=find(v);
        if(a===b){add('note',{},4,'Both endpoints already share a root; do not change size.','দুই প্রান্ত একই সেটে আছে, সাইজ বদলাবে না।');continue;}
        if(size[a]<size[b]){const tmp=a;a=b;b=tmp;}
        parent[b]=a;size[a]+=size[b];components--;
        add('set',{i:b,value:a},5,'Attach the smaller root; equal sizes keep the first representative.','ছোট রুট বড়টার নিচে বসাও; সাইজ সমান হলে প্রথম রুট রাখো।');
        add('list',{name:'size',items:size.slice()},6,'Only root sizes remain meaningful after a merge.','জোড়ার পরে শুধু রুটের সাইজ ব্যবহার করো।');
    }
    const root=find(input.query);
    add('done',{vars:{root,size:size[root],components}},7,'The final query compresses its path without adding a new graph edge.','শেষ ফাইন্ডে পথ ছোট হয়, নতুন গ্রাফ এজ তৈরি হয় না।');
    return{init:{array:[0,1,2,3,4,5,6]},steps};
}
