// week02/MasterDetail/masterDetailStarter.js
import { TeamMemberController } from './controller.js';

const teamMemberController = new TeamMemberController();

document.getElementById('add-teammember').onclick = _ => teamMemberController.addTeamMember();

teamMemberController.addTeamMember();