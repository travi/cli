import {Given} from '@cucumber/cucumber';

Given('the visibility of the project is {string}', async function (visibility) {
  this.visibility = visibility;
});
