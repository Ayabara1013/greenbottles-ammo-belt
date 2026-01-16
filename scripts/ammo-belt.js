import { assignAllCustomAmmoTypes, resetAllAmmoTypes } from './ammo-usage.js';

Hooks.once('init', () => {
  console.log("Greenbottle's Ammo Belt --- Adding custom Ammo Types");

  CONFIG.PF2E.ammoTypes = {
    ...CONFIG.PF2E.ammoTypes,
    // v1.0.0 - Original ammo types
    'gb-ammo-light-rounds': {
      parent: null,
      label: "GB's Light Rounds",
      magazine: false,
      stackGroup: null,
      weapon: null
    },
    'gb-ammo-medium-rounds': {
      parent: null,
      label: "GB's Medium Rounds",
      magazine: false,
      stackGroup: null,
      weapon: null
    },
    'gb-ammo-heavy-rounds': {
      parent: null,
      label: "GB's Heavy Rounds",
      magazine: false,
      stackGroup: null,
      weapon: null
    },
    'gb-ammo-shells': {
      parent: null,
      label: "GB's Shells",
      magazine: false,
      stackGroup: null,
      weapon: null
    },
    'gb-ammo-micro-missiles': {
      parent: null,
      label: "GB's Micro Missiles",
      magazine: false,
      stackGroup: null,
      weapon: null
    },
    
    // v1.1.0 - Added specialized ammo types
    'gb-ammo-darts': {
      parent: null,
      label: "GB's Darts",
      magazine: false,
      stackGroup: null,
      weapon: null
    },
    'gb-ammo-bolts': {
      parent: null,
      label: "GB's Bolts",
      magazine: false,
      stackGroup: null,
      weapon: null
    },
    'gb-ammo-rail-slugs': {
      parent: null,
      label: "GB's Rail Slugs",
      magazine: false,
      stackGroup: null,
      weapon: null
    },
    'gb-ammo-cards': {
      parent: null,
      label: "GB's Cards",
      magazine: false,
      stackGroup: null,
      weapon: null
    }
  };

  console.log("Updated ammo types:", CONFIG.PF2E.ammoTypes);

  // Register setting to track ammo assignment state
  game.settings.register('greenbottles-ammo-belt', 'customAmmoAssigned', {
    name: 'Custom Ammo Types Assigned',
    scope: 'world',
    config: false,
    type: Boolean,
    default: false
  });
});

Hooks.once('ready', () => {
  ui.notifications.info(`Greenbottle's Ammo Belt | Ready`);

  // Register the settings menu
  game.settings.registerMenu('greenbottles-ammo-belt', 'ammoManagement', {
    name: 'Ammo Type Management',
    label: 'Manage Ammo Types',
    hint: 'Assign or reset custom ammo types for weapons',
    icon: 'fas fa-box-open',
    type: AmmoManagementMenu,
    restricted: true // GM only
  });
});

// Settings menu form class
class AmmoManagementMenu extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: 'Ammo Type Management',
      id: 'ammo-management-menu',
      template: 'modules/greenbottles-ammo-belt/templates/ammo-management.html',
      width: 500,
      height: 'auto',
      closeOnSubmit: false
    });
  }

  getData() {
    return {
      customAmmoAssigned: game.settings.get('greenbottles-ammo-belt', 'customAmmoAssigned')
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Assign custom ammo types button
    html.find('#assign-custom-ammo').click(async (event) => {
      event.preventDefault();
      
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = 'Assigning...';

      try {
        const count = await assignAllCustomAmmoTypes();
        await game.settings.set('greenbottles-ammo-belt', 'customAmmoAssigned', true);
        this.render();
      } catch (error) {
        ui.notifications.error('Failed to assign custom ammo types');
        console.error(error);
      } finally {
        button.disabled = false;
        button.textContent = 'Assign Custom Ammo Types';
      }
    });

    // Reset to basic ammo button
    html.find('#reset-ammo').click(async (event) => {
      event.preventDefault();

      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = 'Resetting...';

      try {
        const count = await resetAllAmmoTypes();
        await game.settings.set('greenbottles-ammo-belt', 'customAmmoAssigned', false);
        this.render();
      } catch (error) {
        ui.notifications.error('Failed to reset ammo types');
        console.error(error);
      } finally {
        button.disabled = false;
        button.textContent = 'Reset to Basic Ammo';
      }
    });
  }

  async _updateObject(event, formData) {
    // No form submission needed for this menu
  }
}