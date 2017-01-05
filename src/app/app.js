import angular from 'angular';
import _ from 'lodash';
import { ngTableModule, NgTableParams } from 'ng-table';

import '../style/app.scss';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor(AppService, $q) {
    this._AppService = AppService;
    this._$q = $q;
    this.tableParams;

    this.loadData();
  }

  loadData() {
    this._$q.all([
      this._AppService.getContacts(),
      this._AppService.getOutlets()
    ]).then(res => {
      let contacts = res[0].data.map(c => {
        c.outlet = _.find(res[1].data, ['id', c.outletId]).name;
        return c;
      })
      this.tableParams = new NgTableParams({count: 25}, {
            counts: [],
            dataset: contacts
        });
    })
  }
}

class AppService {
  constructor($http) {
    this._$http = $http;
  }

  getContacts() {
    return this._$http.get('./Contacts.json');
  }

  getOutlets() {
    return this._$http.get('./Outlets.json');
  }
}
AppService.$inject =['$http'];

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [ngTableModule.name])
  .service('AppService', ['$http', AppService])
  .directive('app', app)
  .controller('AppCtrl', ['AppService', '$q', AppCtrl]);

export default MODULE_NAME;