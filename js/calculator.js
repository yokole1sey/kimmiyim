// Yaşam istatistikleri hesap motoru
function calculateStats(birthDate, lifeExpectancy) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  lifeExpectancy = lifeExpectancy || 80;

  var ms = today - birthDate;
  var totalDays   = Math.floor(ms / 86400000);
  var totalHours  = totalDays * 24;
  var totalMins   = totalHours * 60;
  var totalSecs   = totalDays * 86400;

  // Tam yaş
  var age = today.getFullYear() - birthDate.getFullYear();
  var hadBirthday = (
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
     today.getDate() >= birthDate.getDate())
  );
  if (!hadBirthday) age--;

  var heartbeats       = totalMins * 80;
  var breathsTaken     = totalDays * 24 * 60 * 16;
  var blinked          = totalDays * 24 * 60 * 17;
  var sleptHours       = totalDays * 8;
  var stepsTaken       = totalDays * 8000;
  var earthKm          = totalDays * 24 * 107218;
  var bloodPumped      = totalDays * 24 * 60 * 5;
  var babiesBorn       = totalDays * 24 * 60 * 270;
  var lightningStrikes = totalSecs * 100;

  var solarSeen = countPastEclipses(SOLAR_ECLIPSES, birthDate, today);
  var lunarSeen = countPastEclipses(LUNAR_ECLIPSES, birthDate, today);

  return {
    past: {
      days:             totalDays,
      hours:            totalHours,
      minutes:          totalMins,
      age:              age,
      heartbeats:       heartbeats,
      breathsTaken:     breathsTaken,
      blinked:          blinked,
      sleptHours:       sleptHours,
      stepsTaken:       stepsTaken,
      earthKm:          earthKm,
      bloodPumped:      bloodPumped,
      babiesBorn:       babiesBorn,
      lightningStrikes: lightningStrikes,
      solarSeen:        solarSeen,
      lunarSeen:        lunarSeen
    }
  };
}

function calculateFuture(birthDate, lifeExpectancy) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var deathDate = new Date(
    birthDate.getFullYear() + lifeExpectancy,
    birthDate.getMonth(),
    birthDate.getDate()
  );

  var msRemaining    = Math.max(0, deathDate - today);
  var daysRemaining  = Math.floor(msRemaining / 86400000);
  var hoursRemaining = daysRemaining * 24;
  var minsRemaining  = hoursRemaining * 60;
  var yearsLeft      = Math.max(0, Math.floor(daysRemaining / 365.25));
  var heartbeatsLeft = minsRemaining * 80;
  var breathsLeft    = minsRemaining * 16;
  var blinksLeft     = minsRemaining * 17;
  var sleepHoursLeft = daysRemaining * 8;
  var stepsLeft      = daysRemaining * 8000;
  var earthKmLeft    = hoursRemaining * 107218;
  var bloodPumpedLeft = minsRemaining * 5;
  var lightningLeft  = daysRemaining * 86400 * 100;

  var solarFuture = countFutureEclipses(SOLAR_ECLIPSES, today, deathDate);
  var lunarFuture = countFutureEclipses(LUNAR_ECLIPSES, today, deathDate);

  return {
    daysLeft:        daysRemaining,
    yearsLeft:       yearsLeft,
    hoursLeft:       hoursRemaining,
    minutesLeft:     minsRemaining,
    heartbeatsLeft:  heartbeatsLeft,
    breathsLeft:     breathsLeft,
    blinksLeft:      blinksLeft,
    sleepHoursLeft:  sleepHoursLeft,
    stepsLeft:       stepsLeft,
    earthKmLeft:     earthKmLeft,
    bloodPumpedLeft: bloodPumpedLeft,
    lightningLeft:   lightningLeft,
    solarFuture:     solarFuture,
    lunarFuture:     lunarFuture
  };
}

function isValidBirthDate(day, monthIdx, year) {
  // Gerçek tarih kontrolü
  var d = new Date(year, monthIdx, day);
  if (d.getFullYear() !== year || d.getMonth() !== monthIdx || d.getDate() !== day) {
    return false;
  }
  // Geçmişte olmalı
  var today = new Date();
  today.setHours(0,0,0,0);
  return d < today;
}

// ─── Gezegen Verileri ─────────────────────────────────────────────────────
var PLANET_DATA = [
  { name: 'Merkür',  orbitalDays: 87.97,   gravity: 0.38, dayHours: 1407.6,  distMKm: 77    },
  { name: 'Venüs',   orbitalDays: 224.70,  gravity: 0.91, dayHours: 5832,    distMKm: 40    },
  { name: 'Mars',    orbitalDays: 686.97,  gravity: 0.38, dayHours: 24.62,   distMKm: 78    },
  { name: 'Jüpiter', orbitalDays: 4332.59, gravity: 2.53, dayHours: 9.93,    distMKm: 628   },
  { name: 'Satürn',  orbitalDays: 10759.2, gravity: 1.07, dayHours: 10.7,    distMKm: 1275  },
  { name: 'Uranüs',  orbitalDays: 30688.5, gravity: 0.89, dayHours: 17.23,   distMKm: 2724  },
  { name: 'Neptün',  orbitalDays: 60182,   gravity: 1.14, dayHours: 16.1,    distMKm: 4351  }
];

function calculatePlanet(birthDate, planetIndex) {
  var p = PLANET_DATA[planetIndex];
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var totalDays = Math.floor((today - birthDate) / 86400000);

  var planetAge        = Math.floor(totalDays / p.orbitalDays);
  var daysThisYear     = totalDays % p.orbitalDays;
  var daysToNextBday   = Math.round(p.orbitalDays - daysThisYear);
  var planetDaysLived  = Math.round(totalDays * 24 / p.dayHours);
  var weightKg         = Math.round(70 * p.gravity);
  var dayHoursRounded  = Math.round(p.dayHours);

  return {
    planetName:      p.name,
    planetAge:       planetAge,
    weightKg:        weightKg,
    planetDaysLived: planetDaysLived,
    dayHours:        dayHoursRounded,
    daysToNextBday:  daysToNextBday,
    distMKm:         p.distMKm
  };
}

function calculateScreenTime(hoursPerDay, yearsUsing) {
  var totalHours = hoursPerDay * yearsUsing * 365;
  var totalDays  = totalHours / 24;

  return {
    hoursPerDay:      hoursPerDay,
    yearsUsing:       yearsUsing,
    yearsOnScreen:    parseFloat((totalHours / (365 * 24)).toFixed(1)),
    daysOnScreen:     Math.round(totalDays),
    moviesWatched:    Math.round(totalHours / 2),
    booksRead:        Math.round(totalHours / 10),
    kmWalked:         Math.round(totalHours * 5),
    sunrisesMissed:   Math.round(totalDays  * 0.7),
    phoneBatteries:   Math.round(totalHours / 5),
    everestClimbs:    Math.round(totalHours / 250),      // ~250 saat aktif tırmanış/sefer
    worldTours:       Math.round(totalHours / 48),       // ~48 saat uçuşla dünya turu
    languagesLearned: Math.round(totalHours / 600),      // FSI: ~600 saat/dil
    sportYears:       parseFloat((totalHours / 365).toFixed(1)),  // her gün 1 saat spor
    earthWalks:       parseFloat((totalHours * 5 / 40075).toFixed(1)) // 5km/s × dünya çevresi
  };
}
