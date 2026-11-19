function trace(input) {
    const nodes = [{id: 'root', value: 'root'}], children = {root: []};
    const links = {root: {}}, terminal = {}, steps = [];
    let serial = 0;
    const add = (word, show) => {
        let cur = 'root';
        for (const letter of word) {
            if (show) steps.push({op: 'visit', id: cur, line: 1,
                note: {en: `Read ${letter}; reuse the child if that letter already exists.`,
                    bn: `${letter} দেখো। এই অক্ষরের চাইল্ড থাকলে সেটাই ব্যবহার করো।`}});
            if (!links[cur][letter]) {
                const id = 'n' + serial++; links[cur][letter] = id;
                links[id] = {}; children[id] = [];
                nodes.push({id, value: letter}); children[cur].push(id);
                if (show) {
                    steps.push({op: 'create', id, value: letter, line: 2,
                        note: {en: `Create the missing child for ${letter}.`, bn: `${letter}-এর জন্য নতুন চাইল্ড বানাও।`}});
                    steps.push({op: 'add-child', parent: cur, child: id, line: 2,
                        note: {en: 'Attach the new child; shared prefixes retain their existing nodes.',
                            bn: 'নতুন চাইল্ড জুড়ো। আগের প্রিফিক্সের নোডগুলো একই থাকবে।'}});
                }
            }
            cur = links[cur][letter];
        }
        if (terminal[cur]) {
            if (show) steps.push({op: 'note', line: 3, note: {
                en: 'This endpoint is already terminal; do not count the word twice.',
                bn: 'এই শব্দ আগে থেকেই আছে। দুবার গুনো না।'}});
            return;
        }
        terminal[cur] = true;
        const n = nodes.find(n => n.id === cur); n.value += '*';
        if (show) steps.push({op: 'set-value', id: cur, value: n.value, line: 3,
            note: {en: 'Mark this endpoint terminal; a path alone does not store a complete word.',
                bn: 'শেষ নোডে শব্দ শেষ হওয়ার চিহ্ন দাও। শুধু পথ থাকলেই পুরো শব্দ হয় না।'}});
    };
    for (const word of ['car', 'cat', 'do']) add(word, false);
    const init = {nodes: nodes.map(n => ({...n})), children: JSON.parse(JSON.stringify(children)),
        root: 'root', multiway: true};
    if (input.word.length) add(input.word, true);
    const words = [];
    const collect = (cur, prefix) => {
        if (terminal[cur]) words.push(prefix);
        for (const letter of Object.keys(links[cur]).sort()) collect(links[cur][letter], prefix + letter);
    };
    collect('root', '');
    steps.push({op: 'list', name: 'words', items: words, line: 4,
        note: {en: 'Visit children alphabetically and emit only terminal prefixes.',
            bn: 'অক্ষরের ক্রমে চাইল্ড দেখো। শব্দ শেষ হলে তবেই প্রিফিক্সটা দেখাও।'}});
    steps.push({op: 'done', vars: {count: words.length}, line: 5,
        note: {en: `${words.length} distinct words are stored; an empty input leaves the dictionary unchanged.`,
            bn: `${words.length}টা আলাদা শব্দ আছে। ইনপুট খালি হলে নতুন শব্দ যোগ হয় না।`}});
    return {init, steps};
}
