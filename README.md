# Simulador de Desconto - GERAÇÃO DISTRIBUÍDA

Este projeto é um **simulador de desconto** para consumidores que aderem à **Geração Distribuída (GD)**. A aplicação realiza cálculos automáticos com base nos dados fornecidos pelo cliente e exibe os resultados de forma clara e organizada.

## 🚀 Funcionalidades

- Cálculo de economia mensal e anual com a adesão à GD.
- Interface responsiva e amigável.
- Armazenamento local dos dados dos clientes usando **IndexedDB**.
- Exportação dos dados cadastrados em **JSON** e **CSV**.
- Exibição dos dados cadastrados na tela.

## 🛠️ Tecnologias Utilizadas

- **HTML5** e **CSS3**: Estrutura e estilos responsivos.
- **JavaScript**: Lógica de cálculo, armazenamento e manipulação de dados.
- **IndexedDB**: Armazenamento local no navegador.
- **Chart.js** (opcional): Visualização gráfica dos dados.
- **GitHub Pages**: Para publicação online (opcional).

## 💻 Como Usar

1. Clone ou baixe este repositório.
2. Abra o arquivo `Simulador_Tino.html` em qualquer navegador moderno.
3. Preencha os dados do cliente e clique em **Simular**.
4. Veja os resultados exibidos na tela.
5. Os dados serão armazenados localmente.
6. Use o botão **Exportar** para baixar os dados em JSON ou CSV.

## 📦 Estrutura do Projeto

📁 simulador-tino/
├── Simulador_Tino.html
├── style.css
├── script.js
└── README.md

markdown
Copiar
Editar

## 📋 Dados Armazenados

- Nome do cliente
- CPF ou CNPJ
- Código de Instalação
- Código do Cliente
- Classe da Instalação
- Consumo do Mês

*Observação: Demais taxas ou bandeiras não são armazenadas.*

## 📤 Exportação

O sistema permite exportar os dados armazenados para:

- `dados_clientes.json`
- `dados_clientes.csv`

Basta clicar no botão **Exportar**.

## 🧩 Como Contribuir

1. Fork este repositório.
2. Crie uma branch: `git checkout -b minha-feature`.
3. Commit suas alterações: `git commit -m 'Minha nova feature'`.
4. Push para a branch: `git push origin minha-feature`.
5. Abra um **Pull Request**.

## 📝 Licença

Este projeto está sob a licença MIT.

---

**Desenvolvido por Júnior Sousa.**
