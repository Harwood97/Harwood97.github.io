const createAchievement = function() {
  let achievementWrapper = document.createElement('div');
  achievementWrapper.classList.add('achievement-wrapper');

  let achievementBody = `
    <div class="achievement-body">
      <div class="achievement-left">
          <img src="img/achievement.png" alt="">
      </div>
      <div class="achievement-right">
          <p class="achievement-title">Shoot Deer</p>
          <p>You shot deer :)</p>
      </div>
    </div>
  `;

  achievementWrapper.innerHTML = achievementBody;
  document.body.append(achievementWrapper)
  return achievementWrapper;
}

const destroyAchievement = function(achievementWrapper) {
  achievementWrapper.remove()
}

const achievementPop = function() {
  let achievementWrapper = createAchievement();

  setTimeout(function() {
    achievementWrapper.classList.add('animate')
  }, 1);

  setTimeout(function() {
    achievementWrapper.classList.remove('animate')
  }, 4500);

  setTimeout(function() {
    destroyAchievement(achievementWrapper)
  }, 5000);
}

const deerDed = function () {
  let deer = document.querySelector('.deer');
  deer.classList.add('ded');
}

let achievementTrigger = document.querySelector('.achievement');
achievementTrigger.addEventListener('click', () => {
  deerDed();
  achievementPop();
});
