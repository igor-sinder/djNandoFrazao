document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica do Menu Responsivo ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });

    // Fecha o menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
        });
    });

    // --- Integração com Google Sheets (corrigida) ---
    // SUBSTITUA a URL abaixo pela sua URL pública do Google Sheets
    const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSQYVOXlHIf1yslZwVW5Fay4GkFmAkLP7aWAUFkgJbfYMGtoKpPYeSvZIWXlyo1uKWLj8EXcxXpuVhx/pub?gid=0&single=true&output=csv';
    const depoimentosLista = document.getElementById('depoimentos-lista');

    fetch(spreadsheetUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar a planilha. Verifique a URL.');
            }
            return response.text();
        })
        .then(csvText => {
            const linhas = csvText.trim().split('\n').slice(1);
            if (linhas.length === 0 || linhas[0].trim() === '') {
                depoimentosLista.innerHTML = '<p>Ainda não há depoimentos para exibir.</p>';
                return;
            }

            linhas.forEach(linha => {
                const colunas = linha.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                
                if (colunas.length >= 3) {
                    const depoimento = colunas[0].replace(/^"|"$/g, '').replace(/""/g, '"');
                    const autor = colunas[1].replace(/^"|"$/g, '').replace(/""/g, '"');
                    const tipoEvento = colunas[2].replace(/^"|"$/g, '').replace(/""/g, '"');
                    const imageUrl = colunas[3] ? colunas[3].replace(/^"|"$/g, '').replace(/""/g, '"') : null;

                    const depoimentoDiv = document.createElement('div');
                    depoimentoDiv.className = 'depoimento-item';
                    depoimentoDiv.innerHTML = `
                        <div class="depoimento-texto">"${depoimento}"</div>
                        <div class="depoimento-autor">- ${autor}</div>
                        <div class="depoimento-evento">${tipoEvento}</div>
                        ${imageUrl ? `<img src="${imageUrl}" alt="Foto de ${autor}" class="depoimento-foto" />` : ''}
                    `;
                    depoimentosLista.appendChild(depoimentoDiv);
                }
            });
        })
        .catch(error => {
            console.error('Erro na integração com o Google Sheets:', error);
            depoimentosLista.innerHTML = `<p>Não foi possível carregar os depoimentos no momento. Tente novamente mais tarde.</p>`;
        });
});