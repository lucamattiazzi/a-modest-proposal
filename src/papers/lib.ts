const DATA_URL = 'https://connect.biorxiv.org/relate/collection_json.php?grp=181'

export interface Paper {
  rel_title: string
  rel_doi: string
  rel_link: string
  rel_abs: string
  rel_authors: string
  rel_date: string
  rel_site: string
}

export function retrieveData(): Promise<Paper[]> {
  return window
    .fetch(DATA_URL)
    .then(r => r.json())
    .then(r => r.rels)
}
