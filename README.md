# X Media Unblocker

Extensão para Chrome que detecta mídia bloqueada no X (Twitter) por causa do
aviso de "conteúdo sensível" / verificação de idade, e substitui pela mídia
real automaticamente na própria página, sem precisar passar por Discord ou
qualquer outro app.

## Como funciona

Quando você abre o X e tem feed travado por aquele aviso de "esta mídia pode
conter conteúdo sensível" (ou imagens que simplesmente não carregam), a
extensão:

1. Acha o ID do tweet correspondente
2. Busca os dados públicos desse tweet em `api.fxtwitter.com` (o mesmo backend
   usado pelo fixupx.com)
3. Monta a imagem/vídeo real e insere embaixo do tweet bloqueado

Não precisa mais copiar link, mandar pro Discord, esperar o embed e abrir.

## Instalação (modo desenvolvedor)

1. Baixe e descompacte esta pasta em algum lugar do seu computador
2. Abra o Chrome e vá em `chrome://extensions`
3. Ative o "Modo do desenvolvedor" (canto superior direito)
4. Clique em "Carregar sem compactação" (Load unpacked)
5. Selecione a pasta `x-unblock-ext`
6. Abra ou recarregue o x.com — a extensão já começa a varrer a página

## Caso algo não seja desbloqueado automaticamente

Clique no ícone da extensão na barra do Chrome e use o botão
"Forçar nova varredura". Isso limpa as marcações internas e refaz a busca em
todos os tweets visíveis na tela.

## Limitações conhecidas

- Depende da API pública do fxtwitter continuar no ar e respondendo;
  se o X mudar a estrutura do feed (atributos, classes), a detecção do
  aviso de conteúdo sensível pode precisar de ajustes em `content.js`,
  na função `findBlockedTweets`.
- Tweets de contas privadas ou suspensas não retornam dados (o fxtwitter só
  acessa conteúdo público).
- Vídeos podem demorar um pouco mais pra carregar dependendo da resolução
  disponibilizada pela API.

## Arquivos

- `manifest.json` — configuração da extensão (Manifest V3)
- `content.js` — lógica principal: detecção e substituição da mídia
- `style.css` — estilo visual da mídia desbloqueada
- `popup.html` / `popup.js` — janela que abre ao clicar no ícone da extensão
- `icons/` — ícones da extensão
