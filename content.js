/**
 * X Media Unblocker
 * Detecta tweets com midia bloqueada (aviso de conteudo sensivel, midia que
 * falha ao carregar por causa da verificacao de idade) e substitui pela
 * midia real, buscando os dados publicos via api.fxtwitter.com (o mesmo
 * backend usado pelo fixupx.com).
 */

(() => {
  "use strict";

  const PROCESSED_ATTR = "data-xmu-processed";
  const FX_API = "https://api.fxtwitter.com/status";

  // Cache simples em memoria pra nao buscar o mesmo tweet duas vezes
  const cache = new Map();

  /** Extrai o ID numerico do tweet a partir de uma URL tipo /usuario/status/123456 */
  function extractTweetId(url) {
    if (!url) return null;
    const match = url.match(/\/status\/(\d+)/);
    return match ? match[1] : null;
  }

  /** Acha o link "/status/ID" mais proximo de um elemento, subindo na arvore DOM */
  function findStatusIdNear(el) {
    let node = el;
    for (let i = 0; i < 12 && node; i++) {
      // tenta achar um <a> com /status/ dentro do proprio node
      const link = node.querySelector?.('a[href*="/status/"]');
      if (link) {
        const id = extractTweetId(link.getAttribute("href"));
        if (id) return id;
      }
      node = node.parentElement;
    }
    // fallback: tenta pela URL da pagina, se for uma pagina de tweet unico
    return extractTweetId(location.pathname);
  }

  /** Identifica os "artigos" de tweet que tem aviso de conteudo sensivel/bloqueado */
  function findBlockedTweets(root = document) {
    const articles = root.querySelectorAll(`article[role="article"]:not([${PROCESSED_ATTR}])`);
    const blocked = [];

    articles.forEach((article) => {
      const text = article.innerText || "";
      const hasSensitiveWarning =
        /conteúdo sensível|sensitive content|idade|age-restricted|esta mídia pode conter|this media may contain/i.test(
          text
        );

      // imagens que o X tenta carregar mas falham (alt genérico, sem src real, etc)
      const brokenImg = article.querySelector('img[src=""], img:not([src])');

      // botao "ver" / "view" tipico do aviso de sensivel
      const viewButton = Array.from(article.querySelectorAll("div[role='button'], span")).find(
        (n) => /^(ver|view)$/i.test(n.textContent?.trim() || "")
      );

      if (hasSensitiveWarning || brokenImg || viewButton) {
        blocked.push(article);
      }
    });

    return blocked;
  }

  /** Busca os dados do tweet via fxtwitter */
  async function fetchTweetData(id) {
    if (cache.has(id)) return cache.get(id);

    const url = `${FX_API}/${id}`;
    const res = await fetch(url, { credentials: "omit" });
    if (!res.ok) throw new Error(`fxtwitter respondeu ${res.status}`);

    const json = await res.json();
    const tweet = json?.tweet;
    if (!tweet) throw new Error("Resposta sem campo 'tweet'");

    cache.set(id, tweet);
    return tweet;
  }

  /** Monta o card de midia desbloqueada e injeta no lugar do bloqueio */
  function renderUnblockedMedia(article, tweet) {
    const media = tweet.media?.all || [];
    if (media.length === 0) return false;

    const container = document.createElement("div");
    container.className = "xmu-unblocked-container";

    media.forEach((m) => {
      if (m.type === "photo") {
        const img = document.createElement("img");
        img.src = m.url;
        img.className = "xmu-media xmu-photo";
        img.loading = "lazy";
        container.appendChild(img);
      } else if (m.type === "video" || m.type === "gif") {
        const video = document.createElement("video");
        video.src = m.url;
        video.poster = m.thumbnail_url || "";
        video.controls = true;
        video.className = "xmu-media xmu-video";
        container.appendChild(video);
      }
    });

    const badge = document.createElement("div");
    badge.className = "xmu-badge";
    badge.textContent = "Desbloqueado via fxtwitter";
    container.appendChild(badge);

    article.appendChild(container);
    return true;
  }

  async function processArticle(article) {
    article.setAttribute(PROCESSED_ATTR, "1");

    const id = findStatusIdNear(article);
    if (!id) return;

    try {
      const tweet = await fetchTweetData(id);
      renderUnblockedMedia(article, tweet);
    } catch (err) {
      console.warn("[X Media Unblocker] Falha ao buscar tweet", id, err);
    }
  }

  function scan() {
    const blocked = findBlockedTweets();
    blocked.forEach(processArticle);
  }

  // Scan inicial
  scan();

  // O X carrega conteudo dinamicamente via JS, entao observamos mudancas no DOM
  const observer = new MutationObserver(() => {
    // debounce simples pra nao rodar a cada micro-mutacao
    clearTimeout(window.__xmuTimeout);
    window.__xmuTimeout = setTimeout(scan, 400);
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
