export async function generateSellerListing(
  comicData: any,
  conditionGrade: string,
  price: number
): Promise<string> {
  const title = generateTitle(comicData);
  const description = generateDescription(comicData, conditionGrade);
  const keywords = generateKeywords(comicData);

  return `
TITLE:
${title}

PRICE: $${price.toFixed(2)}

CONDITION: ${conditionGrade}

DESCRIPTION:
${description}

DETAILS:
• Title: ${comicData.title}
• Issue: #${comicData.issueNumber}
• Publisher: ${comicData.publisher}
• Published: ${comicData.publishDate}
• Pages: ${comicData.pageCount}
${comicData.writers?.length > 0 ? `• Writer(s): ${comicData.writers.join(', ')}` : ''}
${comicData.artists?.length > 0 ? `• Artist(s): ${comicData.artists.join(', ')}` : ''}
${comicData.colorists?.length > 0 ? `• Colorist(s): ${comicData.colorists.join(', ')}` : ''}

KEYWORDS:
${keywords}

SHIPPING:
Ships within 1-2 business days. Carefully packaged in protective materials.

RETURNS:
30-day money-back guarantee if not satisfied.
  `.trim();
}

function generateTitle(comicData: any): string {
  const title = comicData.title;
  const issue = comicData.issueNumber;
  const publisher = comicData.publisher;

  return `${title} #${issue} - ${publisher} Comic Book`;
}

function generateDescription(comicData: any, conditionGrade: string): string {
  let description = `${comicData.title} Issue #${comicData.issueNumber}\n\n`;

  description += `Condition: ${conditionGrade}\n`;
  description += `Publisher: ${comicData.publisher}\n`;
  description += `Published: ${comicData.publishDate}\n\n`;

  if (comicData.description) {
    description += `Synopsis:\n${comicData.description}\n\n`;
  }

  if (comicData.writers?.length > 0) {
    description += `Written by: ${comicData.writers.join(', ')}\n`;
  }

  if (comicData.artists?.length > 0) {
    description += `Illustrated by: ${comicData.artists.join(', ')}\n`;
  }

  if (comicData.firstAppearances?.length > 0) {
    description += `\nKey Appearances:\n`;
    comicData.firstAppearances.slice(0, 5).forEach((char: string) => {
      description += `• ${char}\n`;
    });
  }

  description += `\nThis is a great addition to any comic collection!`;

  return description;
}

function generateKeywords(comicData: any): string {
  const keywords = [
    comicData.title,
    `${comicData.title} #${comicData.issueNumber}`,
    comicData.publisher,
    'comic book',
    'comic',
    'collectible',
  ];

  if (comicData.writers?.length > 0) {
    keywords.push(...comicData.writers);
  }

  if (comicData.artists?.length > 0) {
    keywords.push(...comicData.artists);
  }

  return keywords.join(', ');
}

export function generateBulkListings(
  comics: any[],
  conditionGrades: string[],
  prices: number[]
): string[] {
  return comics.map((comic, index) =>
    generateSellerListing(comic, conditionGrades[index], prices[index])
  );
}
