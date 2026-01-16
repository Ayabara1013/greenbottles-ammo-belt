import { assignAllCustomAmmoTypes, resetAllAmmoTypes, assignAmmoType } from './ammo-usage.js';
import ammoUsage from './ammo-usage.js';

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

  // Register setting to store individual weapon ammo type overrides
  game.settings.register('greenbottles-ammo-belt', 'weaponAmmoOverrides', {
    name: 'Weapon Ammo Type Overrides',
    scope: 'world',
    config: false,
    type: Object,
    default: {}
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
  constructor(object, options) {
    super(object, options);
    this.pendingChanges = new Set(); // Track which weapons have pending changes
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: 'Ammo Type Management',
      id: 'ammo-management-menu',
      template: 'modules/greenbottles-ammo-belt/templates/ammo-management.html',
      width: 700,
      height: 'auto',
      closeOnSubmit: false,
      tabs: [
        {
          navSelector: '.tabs',
          contentSelector: '.content',
          initial: 'bulk'
        }
      ]
    });
  }

  getData() {
    const overrides = game.settings.get('greenbottles-ammo-belt', 'weaponAmmoOverrides');
    
    // Get all available ammo types from CONFIG
    const availableAmmoTypes = Object.keys(CONFIG.PF2E.ammoTypes)
      .filter(key => key.startsWith('gb-ammo-') || key === 'projectile-ammo')
      .map(key => ({
        key: key,
        label: CONFIG.PF2E.ammoTypes[key].label
      }));

    // Build weapon list with their current assignments
    const weaponConfigs = Object.entries(ammoUsage).map(([key, config]) => {
      const hasOverride = overrides.hasOwnProperty(config.slug);
      const currentType = hasOverride ? overrides[config.slug] : config.type;
      
      return {
        key: key,
        name: this._formatWeaponName(key),
        slug: config.slug,
        defaultType: config.type,
        currentType: currentType,
        hasOverride: hasOverride,
        isModified: this.pendingChanges.has(config.slug)
      };
    });

    return {
      customAmmoAssigned: game.settings.get('greenbottles-ammo-belt', 'customAmmoAssigned'),
      weaponConfigs: weaponConfigs,
      availableAmmoTypes: availableAmmoTypes,
      hasPendingChanges: this.pendingChanges.size > 0
    };
  }

  _formatWeaponName(camelCase) {
    // Convert camelCase to Title Case
    return camelCase
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
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
        this.pendingChanges.clear();
        this.render();
      } catch (error) {
        ui.notifications.error('Failed to assign custom ammo types');
        console.error(error);
      } finally {
        button.disabled = false;
        button.textContent = 'Assign All Custom Ammo Types';
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
        // Clear overrides too
        await game.settings.set('greenbottles-ammo-belt', 'weaponAmmoOverrides', {});
        this.pendingChanges.clear();
        this.render();
      } catch (error) {
        ui.notifications.error('Failed to reset ammo types');
        console.error(error);
      } finally {
        button.disabled = false;
        button.textContent = 'Reset All to Basic Ammo';
      }
    });

    // Individual weapon ammo type change
    html.find('.weapon-ammo-select').change((event) => {
      const select = event.currentTarget;
      const weaponSlug = select.dataset.weaponSlug;
      const defaultType = select.dataset.defaultType;
      const newAmmoType = select.value;
      const row = select.closest('tr');

      // Mark as modified if different from default
      if (newAmmoType !== defaultType) {
        this.pendingChanges.add(weaponSlug);
        row.classList.add('modified');
      } else {
        this.pendingChanges.delete(weaponSlug);
        row.classList.remove('modified');
      }

      // Update button state
      const applyButton = html.find('#apply-individual')[0];
      if (applyButton) {
        applyButton.disabled = this.pendingChanges.size === 0;
      }

      // Update status indicator
      const statusIcon = row.querySelector('.status-icon');
      if (statusIcon) {
        if (newAmmoType !== defaultType) {
          statusIcon.innerHTML = '<i class="fas fa-circle" style="color: orange;" title="Unsaved changes"></i>';
        } else {
          statusIcon.innerHTML = '<i class="fas fa-check-circle" style="color: green;" title="Using default"></i>';
        }
      }
    });

    // Apply individual assignments button
    html.find('#apply-individual').click(async (event) => {
      event.preventDefault();
      
      const button = event.currentTarget;
      button.disabled = true;
      const originalText = button.textContent;
      button.textContent = 'Applying...';

      try {
        const overrides = game.settings.get('greenbottles-ammo-belt', 'weaponAmmoOverrides');
        let updatedCount = 0;

        // Only apply weapons that have pending changes
        for (const weaponSlug of this.pendingChanges) {
          const select = html.find(`.weapon-ammo-select[data-weapon-slug="${weaponSlug}"]`)[0];
          if (!select) continue;

          const newAmmoType = select.value;
          const defaultType = select.dataset.defaultType;

          // Update overrides
          if (newAmmoType !== defaultType) {
            overrides[weaponSlug] = newAmmoType;
          } else {
            // Remove override if set back to default
            delete overrides[weaponSlug];
          }

          // Find all weapons with this slug and update them
          const weapons = game.items.filter(item => 
            item.type === 'weapon' && 
            item.system.slug === weaponSlug
          );

          // Also check actors' inventories
          for (const actor of game.actors) {
            const actorWeapons = actor.items.filter(item =>
              item.type === 'weapon' &&
              item.system.slug === weaponSlug
            );
            weapons.push(...actorWeapons);
          }

          // Update each weapon
          for (const weapon of weapons) {
            await assignAmmoType(weapon, newAmmoType);
            updatedCount++;
          }
        }

        // Save overrides
        await game.settings.set('greenbottles-ammo-belt', 'weaponAmmoOverrides', overrides);

        ui.notifications.info(`Applied custom ammo types to ${updatedCount} weapons`);
        await game.settings.set('greenbottles-ammo-belt', 'customAmmoAssigned', true);
        
        // Clear pending changes and update all status icons
        this.pendingChanges.clear();
        html.find('tr.modified').each((i, row) => {
          row.classList.remove('modified');
          const statusIcon = row.querySelector('.status-icon');
          if (statusIcon) {
            const select = row.querySelector('.weapon-ammo-select');
            const hasOverride = select.value !== select.dataset.defaultType;
            statusIcon.innerHTML = hasOverride 
              ? '<i class="fas fa-circle" style="color: blue;" title="Custom assignment saved"></i>'
              : '<i class="fas fa-check-circle" style="color: green;" title="Using default"></i>';
          }
        });

        button.disabled = true; // Keep disabled until new changes
      } catch (error) {
        ui.notifications.error('Failed to apply individual assignments');
        console.error(error);
      } finally {
        button.textContent = originalText;
      }
    });

    // Reset individual to defaults
    html.find('#reset-individual').click(async (event) => {
      event.preventDefault();
      
      await game.settings.set('greenbottles-ammo-belt', 'weaponAmmoOverrides', {});
      this.pendingChanges.clear();
      ui.notifications.info('Reset individual weapon assignments to defaults');
      this.render();
    });

    // Initialize button state
    const applyButton = html.find('#apply-individual')[0];
    if (applyButton) {
      applyButton.disabled = this.pendingChanges.size === 0;
    }
  }

  async _updateObject(event, formData) {
    // No form submission needed for this menu
  }
}