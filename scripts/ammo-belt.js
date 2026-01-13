


Hooks.once('init', () => {
  // ui.notifications.info(`Greenbottle's Ammo Belt | Initializing`)
  console.log("Greenbottle's Ammo Belt --- Adding custom Ammo Types");

  CONFIG.PF2E.ammoTypes = {
    ...CONFIG.PF2E.ammoTypes,
    'gb-ammo-light': {
      parent: null,
      label: "GB's Light Ammo",
      magazine: false,
      stackGroup: null,
      weapon: null
    },
    'gb-ammo-medium': {
      parent: null,
      label: "GB's Medium Ammo",
      magazine: false,
      stackGroup: null,
      weapon: null
    },
    'gb-ammo-heavy': {
      parent: null,
      label: "GB's Heavy Ammo",
      magazine: false,
      stackGroup: null,
      weapon: null
    },
    'gb-ammo-shell': {
      parent: null,
      label: "GB's Shotgun Shells",
      magazine: false,
      stackGroup: null,
      weapon: null
    },
    'gb-ammo-micro-rockets': {
      parent: null,
      label: "GB's Micro Rockets",
      magazine: false,
      stackGroup: null,
      weapon: null
    },


    // // magazine versions
    // 'gb-ammo-light': {
    //   parent: null,
    //   label: 'Light Ammo',
    //   magazine: false,
    //   stackGroup: null,
    //   weapon: null
    // },
    // 'gb-ammo-medium': {
    //   parent: null,
    //   label: 'Medium Ammo',
    //   magazine: false,
    //   stackGroup: null,
    //   weapon: null
    // },
    // 'gb-ammo-heavy': {
    //   parent: null,
    //   label: 'Heavy Ammo',
    //   magazine: false,
    //   stackGroup: null,
    //   weapon: null
    // },
  };


  console.log("Updated ammo types:", CONFIG.PF2E.ammoTypes);
})


Hooks.once('ready', () => {
  ui.notifications.info(`Greenbottle's Ammo Belt | Initializing`)
  // console.log("Greenbottle's Ammo Belt --- Adding custom Ammo Types");
})