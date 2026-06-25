# Política de Privacidade — X Media Unblocker

**Última atualização:** 24 de junho de 2026

Esta política descreve como a extensão **X Media Unblocker** ("a extensão") trata dados ao ser usada no navegador Chrome.

## Resumo

A extensão não coleta, armazena, vende nem compartilha dados pessoais dos usuários. Ela funciona inteiramente no navegador do usuário e se comunica apenas com a API pública necessária para exibir mídia desbloqueada.

## O que a extensão faz

A extensão é executada nas páginas x.com e twitter.com. Quando detecta um post com aviso de "conteúdo sensível" ou mídia que falhou ao carregar, ela:

1. Identifica o ID público do post na própria página.
2. Faz uma requisição a `api.fxtwitter.com` para obter os dados públicos de mídia desse post (imagem ou vídeo).
3. Insere essa mídia diretamente na página, ao lado do post original.

## Dados coletados

A extensão não coleta nenhum dado pessoal do usuário. Ela não acessa nome de usuário, senha, histórico de navegação, cookies de sessão ou qualquer outra informação de identificação pessoal.

A única informação transmitida a terceiros é o ID público do post do X/Twitter, enviado para `api.fxtwitter.com` com a finalidade exclusiva de buscar a mídia correspondente. Essa requisição é feita sem cookies ou credenciais do usuário (`credentials: "omit"`).

## Armazenamento de dados

A extensão mantém apenas um cache temporário em memória, durante a sessão de navegação, para evitar buscar o mesmo post duas vezes. Esse cache é apagado automaticamente ao fechar ou recarregar a aba e nunca é salvo em disco.

A extensão não utiliza armazenamento persistente (como `chrome.storage`) e não grava cookies próprios.

## Compartilhamento de dados com terceiros

A extensão se comunica apenas com o serviço público `api.fxtwitter.com` para obter dados de mídia de posts públicos. Nenhum dado é enviado a qualquer outro servidor, anunciante ou serviço de análise.

A extensão não contém rastreadores, pixels de anúncio ou ferramentas de analytics.

## Permissões utilizadas

| Permissão | Finalidade |
|---|---|
| Acesso a x.com e twitter.com | Inserir o script que detecta e substitui mídia bloqueada na página |
| Acesso a api.fxtwitter.com | Buscar os dados públicos de mídia do post correspondente |

## Alterações nesta política

Esta política pode ser atualizada caso a extensão passe a oferecer novas funcionalidades. A data da última atualização sempre estará indicada no topo deste documento.

## Contato

Em caso de dúvidas sobre esta política, entre em contato com o desenvolvedor da extensão pelos canais informados na página da extensão na Chrome Web Store.
