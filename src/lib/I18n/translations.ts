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
    'perk.unknown.name': 'Unknown Perk',
    'perk.unknown.description':
      "Oups I don't actually know what perk is that, please force refresh the page or contact the developers if that doesn't help.",
    'perk.unknown.character': 'Unknown',
    'addon.unknown.name': 'Unknown Addon',
    'addon.unknown.description':
      "Oups I don't actually know what addon is that, please force refresh the page or contact the developers if that doesn't help.",
    general: 'GENERAL',
    loadout: 'Current loadout',
    support: 'Support us'
  },
  de: {
    'show.more': 'Klicken Sie, um mehr zu erfahren',
    'show.wikiInfo': 'Die Beschreibungen stammen aus dem',
    'show.addons': 'Addons sind verfügbar',
    'show.perks': 'Sie können mit dem Mauszeiger über die Talente fahren',
    'perk.tooltip.subtitle': '{{actor}} TALENT',
    'perk.unknown.name': 'Unbekannter Perk',
    'perk.unknown.description':
      'Ups, ich weiß eigentlich nicht, welcher Perk das ist. Bitte aktualisieren Sie die Seite oder kontaktieren Sie die Entwickler, wenn das nicht hilft.',
    'perk.unknown.character': 'Unbekannt',
    'addon.unknown.name': 'Unbekanntes Addon',
    'addon.unknown.description':
      'Ups, ich weiß eigentlich nicht, welches Addon das ist. Bitte aktualisieren Sie die Seite oder kontaktieren Sie die Entwickler, wenn das nicht hilft.',
    general: 'ALLGEMEINE',
    loadout: 'Aktuelle Auslastung',
    support: 'Unterstütze uns'
  },
  fr: {
    'show.more': 'Cliquez pour voir les changelogs du perk.',
    'show.wikiInfo': 'Les descriptions proviennent du',
    'show.addons': 'Les addons sont disponibles',
    'show.perks': 'Vous pouvez survoler les compétences',
    'perk.tooltip.subtitle': 'COMPÉTENCE {{actor}}',
    'perk.unknown.name': 'Perk Inconnu',
    'perk.unknown.description':
      'Oups, je ne sais pas vraiment quel est ce perk. Veuillez actualiser la page ou contacter les développeurs si cela ne résout pas le problème.',
    'perk.unknown.character': 'Inconnu',
    'addon.unknown.name': 'Addon Inconnu',
    'addon.unknown.description':
      'Oups, je ne sais pas vraiment quel est cet addon. Veuillez actualiser la page ou contacter les développeurs si cela ne résout pas le problème.',
    general: 'GÉNÉRALE',
    loadout: 'Compétences actuelles',
    support: 'Nous soutenir'
  }
}

export default translations
