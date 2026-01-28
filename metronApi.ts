import axios from 'axios';

const METRON_API_BASE = 'https://metron.cloud/api';

export interface ComicDetails {
  id: string;
  title: string;
  issueNumber: string;
  volume: string;
  publisher: string;
  publishDate: string;
  writers: string[];
  artists: string[];
  colorists: string[];
  letterers: string[];
  coverArtists: string[];
  editors: string[];
  description: string;
  pageCount: number;
  firstAppearances: string[];
  keyEvents: string[];
  variants: string[];
  coverImage?: string;
}

export async function getComicDetails(
  title: string,
  issueNumber: string
): Promise<ComicDetails> {
  try {
    // Search for the comic
    const searchResponse = await axios.get(`${METRON_API_BASE}/issue/`, {
      params: {
        name: title,
        number: issueNumber,
      },
    });

    if (!searchResponse.data.results || searchResponse.data.results.length === 0) {
      throw new Error('Comic not found');
    }

    const issue = searchResponse.data.results[0];

    // Get detailed information
    const detailResponse = await axios.get(`${METRON_API_BASE}/issue/${issue.id}/`);
    const details = detailResponse.data;

    return {
      id: details.id.toString(),
      title: details.series.name,
      issueNumber: details.number,
      volume: details.series.volume_set?.[0]?.name || 'Unknown',
      publisher: details.series.publisher?.name || 'Unknown',
      publishDate: details.cover_date || 'Unknown',
      writers: details.credits
        ?.filter((c: any) => c.role.name === 'Writer')
        .map((c: any) => c.creator.name) || [],
      artists: details.credits
        ?.filter((c: any) => c.role.name === 'Artist')
        .map((c: any) => c.creator.name) || [],
      colorists: details.credits
        ?.filter((c: any) => c.role.name === 'Colorist')
        .map((c: any) => c.creator.name) || [],
      letterers: details.credits
        ?.filter((c: any) => c.role.name === 'Letterer')
        .map((c: any) => c.creator.name) || [],
      coverArtists: details.credits
        ?.filter((c: any) => c.role.name === 'Cover')
        .map((c: any) => c.creator.name) || [],
      editors: details.credits
        ?.filter((c: any) => c.role.name === 'Editor')
        .map((c: any) => c.creator.name) || [],
      description: details.description || 'No description available',
      pageCount: details.page_count || 0,
      firstAppearances: details.characters?.map((c: any) => c.name) || [],
      keyEvents: details.story_arcs?.map((s: any) => s.name) || [],
      variants: details.variant_set?.map((v: any) => v.name) || [],
      coverImage: details.cover?.image?.original_url,
    };
  } catch (error) {
    console.error('Error fetching comic details:', error);
    throw error;
  }
}

export async function searchComics(query: string) {
  try {
    const response = await axios.get(`${METRON_API_BASE}/issue/`, {
      params: {
        name: query,
      },
    });

    return response.data.results.map((issue: any) => ({
      id: issue.id,
      title: issue.series.name,
      issueNumber: issue.number,
      publisher: issue.series.publisher?.name,
      coverDate: issue.cover_date,
    }));
  } catch (error) {
    console.error('Error searching comics:', error);
    throw error;
  }
}

export async function getComicFunFacts(comicId: string): Promise<string[]> {
  try {
    const response = await axios.get(`${METRON_API_BASE}/issue/${comicId}/`);
    const issue = response.data;

    const facts: string[] = [];

    // Add interesting facts
    if (issue.story_arcs && issue.story_arcs.length > 0) {
      facts.push(
        `Part of story arc: ${issue.story_arcs.map((s: any) => s.name).join(', ')}`
      );
    }

    if (issue.characters && issue.characters.length > 0) {
      facts.push(
        `Features: ${issue.characters.slice(0, 3).map((c: any) => c.name).join(', ')}`
      );
    }

    if (issue.reprints && issue.reprints.length > 0) {
      facts.push(`This issue has been reprinted ${issue.reprints.length} times`);
    }

    if (issue.variant_set && issue.variant_set.length > 0) {
      facts.push(`${issue.variant_set.length} variant covers exist for this issue`);
    }

    // Add publication facts
    facts.push(`Published: ${issue.cover_date}`);
    facts.push(`${issue.page_count} pages`);

    return facts;
  } catch (error) {
    console.error('Error fetching fun facts:', error);
    return [];
  }
}
