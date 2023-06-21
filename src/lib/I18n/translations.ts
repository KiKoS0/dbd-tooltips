interface Translations {
  [key: string]: { [key: string]: string }
}

const translations: Translations = {
  en: {
    'show.more': "Click to expand the perk's changelogs",
    'show.wikiInfo': 'Descriptions are from the',
    'show.addons': 'Addons are available',
    'show.perks': 'You can hover over the perks',
    'perk.tooltip.subtitle': '{{actor}} PERK',
    general: 'GENERAL'
  },
  de: {
    'show.more': 'Klicken Sie, um mehr zu erfahren',
    'show.wikiInfo': 'Die Beschreibungen stammen aus dem',
    'show.addons': 'Addons sind verfügbar',
    'show.perks': 'Sie können mit dem Mauszeiger über die Talente fahren',
    'perk.tooltip.subtitle': '{{actor}} TALENT',
    general: 'ALLGEMEINE'
  },
  fr: {
    'show.more': 'Cliquez pour voir les changelogs du perk.',
    'show.wikiInfo': 'Les descriptions proviennent du',
    'show.addons': 'Les addons sont disponibles',
    'show.perks': 'Vous pouvez survoler les compétences',
    'perk.tooltip.subtitle': 'COMPÉTENCE {{actor}}',
    general: 'GÉNÉRALE'
  }
}

export default translations
