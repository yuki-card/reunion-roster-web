document.addEventListener('DOMContentLoaded', () => {
    const lineNameInput = document.getElementById('line-name-input');
    const realNameInput = document.getElementById('real-name-input');
    const yomiganaInput = document.getElementById('yomigana-input');
    const addButton = document.getElementById('add-button');
    const searchInput = document.getElementById('search-input');
    const rosterList = document.getElementById('roster-list');

    let participants = JSON.parse(localStorage.getItem('reunionRoster')) || [];

    const saveRoster = () => {
        localStorage.setItem('reunionRoster', JSON.stringify(participants));
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
            id: Date.now(),
            lineName: lineName,
            realName: realName,
            yomigana: yomigana
        };

        participants.push(newParticipant);
        saveRoster();
        lineNameInput.value = '';
        realNameInput.value = '';
        yomiganaInput.value = '';
        renderRoster(searchInput.value);
    };

    const deleteParticipant = (id) => {
        participants = participants.filter(p => p.id !== id);
        saveRoster();
        renderRoster(searchInput.value);
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

    renderRoster();
});
