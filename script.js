document.addEventListener('DOMContentLoaded', () => {
    const lineNameInput = document.getElementById('line-name-input');
    const realNameInput = document.getElementById('real-name-input');
    const yomiganaInput = document.getElementById('yomigana-input');
    const addButton = document.getElementById('add-button');
    const searchInput = document.getElementById('search-input');
    const rosterList = document.getElementById('roster-list');

    // =====================================================================
    // Firebaseの設定 (YOUR_... の部分をあなたの情報に置き換えてください)
    // =====================================================================
   const firebaseConfig = {
  apiKey: "AIzaSyAobMzYVkR88iiJoaLDO3517umgCIgyf8I",
  authDomain: "reunion-roster-app.firebaseapp.com",
  databaseURL: "https://reunion-roster-app-default-rtdb.firebaseio.com",
  projectId: "reunion-roster-app",
  storageBucket: "reunion-roster-app.firebasestorage.app",
  messagingSenderId: "14899019698",
  appId: "1:14899019698:web:e52939b6ade9f944c76eab",
    };

    // Firebaseを初期化
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const rosterRef = database.ref('reunionRoster'); // 'reunionRoster'というパスにデータを保存
    // =====================================================================

    let participants = []; // 表示・編集用のデータ

    // Firebaseからデータをロード
    const loadParticipantsFromFirebase = () => {
        rosterRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Firebaseから取得したオブジェクトを配列に変換
                participants = Object.values(data);
            } else {
                participants = [];
            }
            renderRoster(searchInput.value);
        });
    };

    // Firebaseにデータを保存
    const saveParticipantsToFirebase = () => {
        // 配列をFirebaseに保存するためにオブジェクト形式に変換
        // 各要素にユニークなキー（ID）を持たせる
        const dataToSave = {};
        participants.forEach(p => {
            dataToSave[p.id] = p;
        });
        rosterRef.set(dataToSave);
    };

    const renderRoster = (filterText = '') => {
        rosterList.innerHTML = '';
        const filteredParticipants = participants.filter(p => 
            p.lineName.toLowerCase().includes(filterText.toLowerCase()) ||
            p.realName.toLowerCase().includes(filterText.toLowerCase()) ||
            p.yomigana.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filteredParticipants.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = filterText ? '該当する参加者はいません。' : '参加者はまだ登録されていません。';
            rosterList.appendChild(emptyMessage);
            return;
        }

        filteredParticipants.forEach(p => {
            const li = document.createElement('li');
            li.dataset.id = p.id;

            const namesDiv = document.createElement('div');
            namesDiv.className = 'names';

            const lineNameSpan = document.createElement('span');
            lineNameSpan.className = 'line-name';
            lineNameSpan.textContent = p.lineName;

            const realNameSpan = document.createElement('span');
            realNameSpan.className = 'real-name';
            realNameSpan.textContent = p.realName;

            const yomiganaSpan = document.createElement('span');
            yomiganaSpan.className = 'yomigana';
            yomiganaSpan.textContent = `(${p.yomigana})`;

            namesDiv.appendChild(lineNameSpan);
            namesDiv.appendChild(realNameSpan);
            namesDiv.appendChild(yomiganaSpan);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.addEventListener('click', () => {
                deleteParticipant(p.id);
            });

            li.appendChild(namesDiv);
            li.appendChild(deleteBtn);
            rosterList.appendChild(li);
        });
    };

    const addParticipant = () => {
        const lineName = lineNameInput.value.trim();
        const realName = realNameInput.value.trim();
        const yomigana = yomiganaInput.value.trim();

        if (lineName === '' || realName === '' || yomigana === '') {
            alert('LINEネーム、リアルネーム、よみがなのすべてを入力してください。');
            return;
        }

        const newParticipant = {
            id: Date.now(), // ユニークなIDを生成
            lineName: lineName,
            realName: realName,
            yomigana: yomigana
        };

        participants.push(newParticipant);
        saveParticipantsToFirebase(); // Firebaseに保存
        lineNameInput.value = '';
        realNameInput.value = '';
        yomiganaInput.value = '';
        // renderRosterはFirebaseからのデータ更新で自動的に呼ばれる
    };

    const deleteParticipant = (id) => {
        participants = participants.filter(p => p.id !== id);
        saveParticipantsToFirebase(); // Firebaseに保存
        // renderRosterはFirebaseからのデータ更新で自動的に呼ばれる
    };

    addButton.addEventListener('click', addParticipant);
    lineNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') realNameInput.focus();
    });
    realNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') yomiganaInput.focus();
    });
    yomiganaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addParticipant();
    });

    searchInput.addEventListener('input', (e) => {
        renderRoster(e.target.value);
    });

    // 初期ロードとレンダリング
    loadParticipantsFromFirebase(); // Firebaseからデータをロード
});
