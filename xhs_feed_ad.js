/**
 * 小红书 - 去信息流广告脚本
 * 适用于 Loon
 */
(function () {
  try {
    const rawBody = $response.body;
    if (!rawBody) { $done({}); return; }

    let json;
    try { json = JSON.parse(rawBody); } catch (e) { $done({}); return; }

    const AD_TYPES = ["ad","ads","advert","advertisement","sponsor","sponsored","promote","promotion","feed_ad","native_ad"];

    function isAd(item) {
      if (!item || typeof item !== "object") return false;
      const type = (item.type || item.card_type || "").toLowerCase();
      if (AD_TYPES.some(t => type.includes(t))) return true;
      if (item.note_card) {
        const nc = item.note_card;
        if (nc.ad_info || nc.ad_mark || nc.is_ad) return true;
      }
      if (item.ad_info || item.is_ad || item.ad_mark || item.ad_id) return true;
      return false;
    }

    const fields = ["items","notes","feeds","data","result","list"];
    function clean(node) {
      if (!node || typeof node !== "object") return;
      for (const f of fields) {
        if (Array.isArray(node[f])) {
          node[f] = node[f].filter(i => !isAd(i));
          node[f].forEach(i => clean(i));
        }
      }
    }

    clean(json);
    $done({ body: JSON.stringify(json) });
  } catch (e) {
    $done({});
  }
})();
