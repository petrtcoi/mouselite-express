import versionCreate from "./versionCreate";
import versionUpdate from './versionUpdate'
import versionDelete from './versionDelete'
import get from './get'
import copy from './versionCopy'

const versionFuncs = {
    versionCreate: versionCreate,
    versionUpdate: versionUpdate,
    versionDelete: versionDelete,
    get: get,
    copy: copy
}

export default versionFuncs