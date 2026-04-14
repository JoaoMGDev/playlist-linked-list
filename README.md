🎵 Playlist Manager - Estrutura de Dados

Uma aplicação web desenvolvida com fins acadêmicos para demonstrar, na prática, o funcionamento e a manipulação de Listas Lineares (especificamente uma Lista Encadeada Simples / Singly Linked List).

O sistema permite o gerenciamento de uma playlist de músicas, onde os dados são armazenados e manipulados estritamente em memória através de ponteiros, sem a utilização de arrays nativos para a lógica principal de armazenamento.

🎯 Objetivo Acadêmico

Compreender o funcionamento interno de uma estrutura de dados do tipo Lista Linear, implementando manualmente operações fundamentais como inserção, remoção, busca e travessia, além de analisar o custo computacional (Big O) de cada operação.

✨ Funcionalidades

    Adição: Inserção de novas músicas (nós) no final da lista.

    Remoção: Exclusão de músicas manipulando os ponteiros para isolar o nó.

    Busca Sequencial: Procura de músicas pelo título com travessia nó a nó.

    Reordenação: Alteração da posição de uma música na playlist (desconexão e reconexão de ponteiros).

    Contador de Passos: Um "profiler" visual que exibe quantas iterações (passos) o algoritmo levou para concluir cada operação, evidenciando a complexidade O(N) da lista encadeada.

🧠 Arquitetura e Estrutura de Dados

A lógica central da aplicação ignora abstrações modernas (como arrays do JavaScript) e implementa o conceito "cru" de Listas Encadeadas:

    Node (Nó): Cada música é um objeto contendo seus metadados (Título, Artista, Duração) e uma propriedade next (ponteiro) que aponta para a próxima música.

    LinkedList (Lista): Uma classe que gerencia o estado inicial (head) e contém todos os métodos de manipulação da estrutura.

Vantagens e Limitações (Vetor vs Lista Encadeada)

    Vantagem: Alocação puramente dinâmica. Inserir ou remover elementos, especialmente no início ou no meio (após encontrar a posição), exige apenas a troca de ponteiros, sem a necessidade de fazer o "shift" (deslocamento) de todos os itens subsequentes na memória, como ocorre em um Vetor estático.

    Limitação: Custo de busca. Diferente de um vetor que permite acesso aleatório em tempo constante O(1) através de um índice, a lista encadeada exige uma travessia sequencial. Para acessar a última música, o algoritmo deve passar por todas as anteriores, resultando em um tempo linear O(N).

🚀 Como Executar o Projeto

Certifique-se de ter o Node.js instalado em sua máquina.

    1. Clone este repositório:



    2. Acesse a pasta do projeto:



    3. Instale as dependências:

        npm install

    4. Inicie o servidor de desenvolvimento:

        npm run dev

    5. Abra o navegador no endereço indicado no terminal (geralmente http://localhost:5173 ou http://localhost:8080).