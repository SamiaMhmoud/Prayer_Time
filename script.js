let apiKey = "4951065bacb54b908f1df5086fc69429";
let date = new Date();

// Select Html Elements
let yearH = document.querySelector(".date .year"),
    monthH = document.querySelector(".date .month"),
    dayHNumber = document.querySelector(".date .day-number"),
    dayH = document.querySelector(".date .day"),
    city = document.querySelector(".city");
// Check geolocation
if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(postion=> {
    let { latitude, longitude } = postion.coords;
    axios
      // Get Location
      .get(
        `https://api.opencagedata.com/geocode/v1/json`,
        {
          params: {
            q: ` ${latitude} + ${longitude}`,
            key: apiKey,
          },
        }
      )
      .then((response) => {
        city.innerHTML = response.data.results[0].components.state;
        axios
          // Get Date & Prayer Times
          .get(
            `http://api.aladhan.com/v1/calendar`,
            {
              params: {
                day: date.getFullYear(),
                month: date.getMonth() + 1,
                latitude: latitude,
                longitude: longitude
              },
            }
          )
          .then((response) => {
            getDateAndTime(response);
          })
      });
    }, () => {
      getDateAndTimeForCity("SA", "	Makkah");
    })
}else {
  getDateAndTimeForCity("SA", "	Makkah");
}
// 	Al Quds Dimashq Abū Z̧aby Ar Riyāḑ 	Şanʻā’ 	Ţarābulus Alger Tunis Rabat Nuwākshūţ ash Shamālīyah Al ‘Āşimah Ad Dawḩah Bayrūt 	Mudug Masqaţ Baghdād Cairo Al ‘Āşimah Al Kharţūm
// Al Madīnah al Munawwarah 	Makkah al Mukarramah
// Get Date & Time From any API
function getDateAndTime(response) {
  if (city.innerHTML === "") {
    city.innerHTML = "مكه المكرمة";
  }
  // Get Date Hijri
  dayH.innerHTML = response.data.data[date.getDate() - 1].date.hijri.weekday.ar;
  dayHNumber.innerHTML = " - " + response.data.data[date.getDate() - 1].date.hijri.day;
  monthH.innerHTML = response.data.data[date.getDate() - 1].date.hijri.month.ar;
  yearH.innerHTML = response.data.data[date.getDate() - 1].date.hijri.year;

  // Get Prayer Times
  document.querySelectorAll(".prayer-times .time").forEach((prayer) => {
    prayer.innerHTML = response.data.data[date.getDate() - 1].timings[
      `${prayer.dataset.prayer}`
    ].replace("(EEST)", " ");
  });
}

// Get Date & Time For specific City
function getDateAndTimeForCity(country,city) {
      axios
        .get(
          `http://api.aladhan.com/v1/calendarByCity`,
          {
            params: {
              day: date.getFullYear(),
              month: date.getMonth() + 1,
              country: country,
              city: city
            },
          }
        )
        .then((response) => {
          getDateAndTime(response);
        })
        .catch(error=> {
          alert("Somthing Wrong");
        })
}

document.querySelector("#citys-prayer").addEventListener('change', (e) => {
  document.querySelectorAll("#citys-prayer option").forEach((option) => {
    if (option.innerHTML == e.target.value) {
      city.innerHTML = e.target.value;
      getDateAndTimeForCity(option.dataset.country, option.dataset.city);
    }
  });
})