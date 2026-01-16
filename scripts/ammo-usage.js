import ammoTypes from './ammo-types.js';

const ammoUsage = {
  crossbolter: {
    slug: 'crossbolter',
    type: ammoTypes['gb-ammo-bolts']
  },
  cardSlinger: {
    slug: 'card-slinger',
    type: ammoTypes['gb-ammo-cards']
  },
  acidDartRifle: {
    slug: 'acid-dart-rifle',
    type: ammoTypes['gb-ammo-darts']
  },
  seekerRifle: {
    slug: 'seeker-rifle',
    type: ammoTypes['gb-ammo-heavy-rounds']
  },
  assassinRifle: {
    slug: 'assassin-rifle',
    type: ammoTypes['gb-ammo-heavy-rounds']
  },
  shirrenEyeRifle: {
    slug: 'shirren-eye-rifle',
    type: ammoTypes['gb-ammo-heavy-rounds']
  },
  shobhadLongrifle: {
    slug: 'shobhad-longrifle',
    type: ammoTypes['gb-ammo-heavy-rounds']
  },
  semiAutoPistol: {
    slug: 'semi-auto-pistol',
    type: ammoTypes['gb-ammo-light-rounds']
  },
  rotatingPistol: {
    slug: 'rotating-pistol',
    type: ammoTypes['gb-ammo-light-rounds']
  },
  autotargetRifle: {
    slug: 'autotarget-rifle',
    type: ammoTypes['gb-ammo-medium-rounds']
  },
  machineGun: {
    slug: 'machine-gun',
    type: ammoTypes['gb-ammo-medium-rounds']
  },
  reactionBreacher: {
    slug: 'reaction-breacher',
    type: ammoTypes['gb-ammo-micro-missiles']
  },
  stellarCannon: {
    slug: 'stellar-cannon',
    type: ammoTypes['gb-ammo-micro-missiles']
  },
  gyrojetPistol: {
    slug: 'gyrojet-pistol',
    type: ammoTypes['gb-ammo-micro-missiles']
  },
  coilRifle: {
    slug: 'coil-rifle',
    type: ammoTypes['gb-ammo-rail-slugs']
  },
  magnetarRifle: {
    slug: 'magnetar-rifle',
    type: ammoTypes['gb-ammo-rail-slugs']
  },
  scattergun: {
    slug: 'scattergun',
    type: ammoTypes['gb-ammo-shells']
  },
  breachingGun: {
    slug: 'breaching-gun',
    type: ammoTypes['gb-ammo-shells']
  }
};

/**
 * Assign a specific ammo type to a weapon based on its slug
 * @param {Item} weapon - The weapon item to update
 * @param {string} ammoTypeSlug - The slug of the ammo type to assign
 * @returns {Promise<void>}
 */
async function assignAmmoType(weapon, ammoTypeSlug) {
  if (!weapon || weapon.type !== 'weapon') {
    console.warn('Invalid weapon provided to assignAmmoType');
    return;
  }

  try {
    await weapon.update({
      'system.ammo.baseType': ammoTypeSlug
    });
    console.log(`Assigned ${ammoTypeSlug} to ${weapon.name}`);
  } catch (error) {
    console.error(`Failed to assign ammo type to ${weapon.name}:`, error);
  }
}

/**
 * Assign custom ammo types to all configured weapons in the world
 * @returns {Promise<number>} Number of weapons updated
 */
async function assignAllCustomAmmoTypes() {
  let updatedCount = 0;

  // Iterate through all configured weapons in ammoUsage
  for (const [key, config] of Object.entries(ammoUsage)) {
    const weaponSlug = config.slug;
    const ammoTypeSlug = config.type;

    // Find all weapons in the world with this slug
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

    // Update each found weapon
    for (const weapon of weapons) {
      await assignAmmoType(weapon, ammoTypeSlug);
      updatedCount++;
    }
  }

  ui.notifications.info(`Updated ${updatedCount} weapons with custom ammo types`);
  console.log(`Assigned custom ammo types to ${updatedCount} weapons`);
  return updatedCount;
}

/**
 * Reset a weapon's ammo type back to basic projectile ammo
 * @param {Item} weapon - The weapon item to reset
 * @returns {Promise<void>}
 */
async function resetAmmoType(weapon) {
  if (!weapon || weapon.type !== 'weapon') {
    console.warn('Invalid weapon provided to resetAmmoType');
    return;
  }

  try {
    await weapon.update({
      'system.ammo.baseType': 'projectile-ammo'
    });
    console.log(`Reset ${weapon.name} to projectile-ammo`);
  } catch (error) {
    console.error(`Failed to reset ammo type for ${weapon.name}:`, error);
  }
}

/**
 * Reset all configured weapons back to basic projectile ammo
 * @returns {Promise<number>} Number of weapons reset
 */
async function resetAllAmmoTypes() {
  let resetCount = 0;

  // Iterate through all configured weapons in ammoUsage
  for (const [key, config] of Object.entries(ammoUsage)) {
    const weaponSlug = config.slug;

    // Find all weapons in the world with this slug
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

    // Reset each found weapon
    for (const weapon of weapons) {
      await resetAmmoType(weapon);
      resetCount++;
    }
  }

  ui.notifications.info(`Reset ${resetCount} weapons to projectile-ammo`);
  console.log(`Reset ${resetCount} weapons to basic projectile ammo`);
  return resetCount;
}

export default ammoUsage;
export {
  assignAmmoType,
  assignAllCustomAmmoTypes,
  resetAmmoType,
  resetAllAmmoTypes
};