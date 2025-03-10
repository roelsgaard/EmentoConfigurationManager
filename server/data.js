// Initial data
export const data = {
  environments: [
    { id: '1', name: 'dk-prod', created_at: new Date().toISOString() },
    { id: '2', name: 'de-prod', created_at: new Date().toISOString() },
    { id: '3', name: 'guide', created_at: new Date().toISOString() }
  ],
  
  customers: [
    { id: '1', name: 'rm-auh', domain: 'rm-auh.emento.dk', environment_id: '1', created_at: new Date().toISOString() },
    { id: '2', name: 'rm-hev', domain: 'rm-hev.emento.dk', environment_id: '1', created_at: new Date().toISOString() },
    { id: '3', name: 'uker', domain: 'uker.emento.de', environment_id: '2', created_at: new Date().toISOString() },
    { id: '4', name: 'sak', domain: 'sak.emento.de', environment_id: '2', created_at: new Date().toISOString() },
    { id: '5', name: 'lanserhof-sylt', domain: 'lanserhof-sylt.emento.guide', environment_id: '3', created_at: new Date().toISOString() }
  ],

  services: [
    {
      id: '1',
      name: 'EmentoTrack',
      root_path: 'track',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'EmentoServer',
      root_path: 'server',
      created_at: new Date().toISOString()
    }
  ],

  modules: [
    {
      id: '1',
      name: 'Content Providers',
      description: 'Configuration for various content providers',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Universal Links',
      description: 'Configuration for universal links and deep linking',
      created_at: new Date().toISOString()
    }
  ],

  variables: [
    {
      name: "No Value Validation",
      type: "string",
      jsonPath: "test.noValue",
      description: "testing validation if global prop has no value",
      service_id: "1",
      id: "4ekepql2fasd",
      created_at: "2025-03-08T16:52:04.461Z",
      updated_at: "2025-03-08T16:52:04.461Z"
    },
    {
      name: "types",
      type: "array",
      defaultValue: ["video", "image", "episerver"],
      jsonPath: "contentProviders.ementoMedia.types",
      description: "Imported from JSON: types",
      service_id: "2",
      module_id: "1",
      id: "4ekepql2f",
      created_at: "2025-03-08T16:52:04.461Z",
      updated_at: "2025-03-08T16:52:04.461Z"
    },
    {
      name: "url",
      type: "string",
      defaultValue: "https://staging-customer1.emento.dk/media",
      jsonPath: "contentProviders.ementoMedia.url",
      description: "Imported from JSON: url",
      service_id: "2",
      module_id: "1",
      id: "0iw2qk3oc",
      created_at: "2025-03-08T16:52:04.467Z",
      updated_at: "2025-03-08T16:52:04.467Z"
    },
    {
      name: "enabled",
      type: "boolean",
      defaultValue: true,
      jsonPath: "contentProviders.ementoQuestion.enabled",
      description: "Imported from JSON: enabled",
      service_id: "2",
      module_id: "1",
      id: "vx5elac6w",
      created_at: "2025-03-08T16:52:04.478Z",
      updated_at: "2025-03-08T16:52:04.478Z"
    },
    {
      name: "enabled",
      type: "boolean",
      defaultValue: true,
      jsonPath: "contentProviders.geoFence.enabled",
      description: "Imported from JSON: enabled",
      service_id: "2",
      module_id: "1",
      id: "3epa7jrew",
      created_at: "2025-03-08T16:52:04.489Z",
      updated_at: "2025-03-08T16:52:04.489Z"
    },
    {
      name: "enabled",
      type: "boolean",
      defaultValue: true,
      jsonPath: "contentProviders.journl.enabled",
      description: "Imported from JSON: enabled",
      service_id: "2",
      module_id: "1",
      id: "rx0a1ec4t",
      created_at: "2025-03-08T16:52:04.498Z",
      updated_at: "2025-03-08T16:52:04.498Z"
    },
    {
      name: "enabled",
      type: "boolean",
      defaultValue: true,
      jsonPath: "contentProviders.meedio.enabled",
      description: "Imported from JSON: enabled",
      service_id: "2",
      module_id: "1",
      id: "kx42a9xz2",
      created_at: "2025-03-08T16:52:04.509Z",
      updated_at: "2025-03-08T16:52:04.509Z"
    },
    {
      name: "enabled",
      type: "boolean",
      defaultValue: true,
      jsonPath: "contentProviders.signature.enabled",
      description: "Imported from JSON: enabled",
      service_id: "2",
      module_id: "1",
      id: "0r6rqw0yt",
      created_at: "2025-03-08T16:52:04.519Z",
      updated_at: "2025-03-08T16:52:04.519Z"
    },
    {
      name: "enabled",
      type: "boolean",
      defaultValue: true,
      jsonPath: "contentProviders.surveyXact.enabled",
      description: "Imported from JSON: enabled",
      service_id: "2",
      module_id: "1",
      id: "dqkdm7u6u",
      created_at: "2025-03-08T16:52:04.529Z",
      updated_at: "2025-03-08T16:52:04.529Z"
    },
    {
      name: "url",
      type: "string",
      defaultValue: "https://emento-development.23video.com",
      jsonPath: "contentProviders.video23Config.url",
      description: "Imported from JSON: url",
      service_id: "2",
      module_id: "1",
      id: "uwir09hu8",
      created_at: "2025-03-08T16:52:04.538Z",
      updated_at: "2025-03-08T16:52:04.538Z"
    },
    {
      name: "customerLinkCountry",
      type: "string",
      defaultValue: "dk",
      jsonPath: "universalLinks.customerLinkCountry",
      description: "Imported from JSON: customerLinkCountry",
      service_id: "1",
      module_id: "2",
      id: "6soa7mvsw",
      created_at: "2025-03-08T16:55:01.294Z",
      updated_at: "2025-03-08T16:55:01.294Z"
    },
    {
      name: "customerLinkDomain",
      type: "string",
      defaultValue: "staging-verify-customerlink.emento.dk",
      jsonPath: "universalLinks.customerLinkDomain",
      description: "Imported from JSON: customerLinkDomain",
      service_id: "1",
      module_id: "2",
      id: "96e7i3nfc",
      created_at: "2025-03-08T16:55:01.304Z",
      updated_at: "2025-03-08T16:55:01.304Z"
    },
    {
      name: "customerLinkMode",
      type: "string",
      defaultValue: "citizen",
      jsonPath: "universalLinks.customerLinkMode",
      description: "Imported from JSON: customerLinkMode",
      service_id: "1",
      module_id: "2",
      id: "vss9q97nf",
      created_at: "2025-03-08T16:55:01.314Z",
      updated_at: "2025-03-08T16:55:01.314Z"
    }
  ],

  values: [],
  hiddenVariables: []
};