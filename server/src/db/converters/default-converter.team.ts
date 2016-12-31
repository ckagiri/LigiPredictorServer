class DefaultSeasonConverter {
  provider = 'LIGI';

  from(obj: any) {
    return {
      api_detail: {
        [this.provider]: {
          id: obj.slug
        }
      },
      name: obj.name,
      shortName: obj.shortName,
      code: obj.code,
      slug: obj.slug,
      aliases: obj.aliases
    };
  }
}

export default new DefaultSeasonConverter();