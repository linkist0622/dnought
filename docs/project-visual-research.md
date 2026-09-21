# Project images and motion — research record

Date: 2026-09-20. Scope: Dreadnought's five project introductions. Adopted VMV, ownership distinctions and contact details are unchanged.

| Project | Confirmed service / positioning | Selected visual | Source |
|---|---|---|---|
| SHINING DAY | Zenpukuji community support and small day-service concept; opening preparation. Dreadnought promotes the project, NPO DANKAI backs it as a separate entity. | The official concept illustration of three generations teaching one another around a mahjong table. Not actual visitors or facility photography. | https://shining-day.com ; https://shining-day.com/assets/shared-table.webp |
| SHINING food | Delivery/takeout concept for Kita-Karuizawa and Tsumagoi; the supplied sites show OWNER PREVIEW v2.4, provisional items and no actual orders/payment. | Colorful bowl photo already used by the service demo. Captioned 料理イメージ; not represented as a confirmed menu item. | https://shining-food.com ; https://shining-food.com/images/rice-bowl.jpg |
| OIMO cafe | A sweet-potato farmer's cafe in Kamitome, Miyoshi. The project supports the cafe, not a Dreadnought-owned shop. | Official photograph of sweet potatoes roasting inside a pot. | https://oimocafe.com/fr/2 ; https://oimocafe.jp/store/images/kamitome/photo02.jpg |
| SHININGresort | Kita-Karuizawa resort development; preserve preparation status, do not promise operational hotel facilities or permits. | User-provided photograph of trees, wooden garden tables and the building. | Library original IMG_2136.jpeg; libfile_7f1bd7cef8708191bb3ea8713e74459f. Cross-reference http://shiningmore.jp/resort.html |
| Cafe&Bar あさま | Planned on-site dining brand; distinct from SHINING food delivery/takeout. AI management project support. | User-provided lounge photo with garden-facing windows, sofas and record shelves. It matches the official resort gallery and the prior Asama photo shortlist. | Library original IMG_1871.jpeg; libfile_b896fc0eb1548191bf45d7f7b0c23fbd. Matching official photo http://shiningmore.jp/assets/library-lounge.jpg |

## Research boundaries

The authoritative attached Dreadnought basic-information document was read. Public web lookup was attempted for each business, followed by successful direct official-page HTTP retrieval where the search reader did not expose content. Cafe&Bar Asama's supplied review URL returned 403; its current live copy was not independently inspected. Instead the user's prior photo shortlist was inspected, its lounge picture matched to the official gallery, and the high-resolution user originals were obtained. Photos are not used as evidence of current opening status. No unverified numbers, contracts or ownership relationships were introduced.

The official DAY/FOOD/OIMO sources do not expose a permissive reuse license. These are user-identified affiliated service sources, not stock-photo license claims; record the provenance for future asset-rights review. OIMO's alternate interior image carried a photographer credit and was not selected. A SHINING main-hall asset with uncertain editing history was not selected. The resort and lounge use the supplied originals rather than low-resolution website copies.

## Production assets

`public/images/projects/{day,food,oimo,resort,asama}.webp` plus each `-840.webp` smaller version. Original aspect ratios are retained, with no enlargement, invented objects, retouching, added steam or facial animation. Conversion to WebP, orientation normalization and size reduction only; the website crops through CSS. Main frames display at 2.1:1, compact desktop 2.8:1; low-height phones use a 118px-wide 1.6:1 thumbnail so all text fits. Captions distinguish concept images and actual supplied spaces.

## Motion decision

These are **static WebP files animated by CSS**, not embedded animated-WebP files. WebP supports animation (https://developers.google.com/speed/webp), but a small CSS camera movement keeps the photographs light and allows the site's motion setting to stop them immediately. No image/video generation service was used; every visual derives from an official or supplied asset.

- DAY: gentle lateral drift, 12 seconds each direction.
- FOOD: slow 1.025–1.09 zoom, 11 seconds each direction.
- OIMO: subtle horizontal framing, 14 seconds each direction.
- Resort: small vertical movement and retreat, 16 seconds each direction.
- Asama: gentle pullback, 15 seconds each direction.

Only an intersecting, active page animates. Hidden pages, out-of-view images and a hidden browser tab pause. The global motion OFF control and OS prefers-reduced-motion remove image animation and transform. Plain HTML, alt text, figure captions and stable aspect ratios remain. Existing GSAP page transitions act on the page, while CSS acts on the image; they do not control the same element.

Behavior reference: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-play-state

## Editing

- `app/site-content.ts`: service descriptions, alt text, captions, local asset references.
- `app/project-visual.tsx`: responsive images and visibility observation.
- `app/globals.css`: framing, movement amplitude/duration and compact image layout.

No changes to the five source business websites were made.
