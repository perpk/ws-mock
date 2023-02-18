import MappingException from './MappingException'
import MappingConstants from './MappingConstants'

class MappingValidator implements Validator {
  validate(object: any): void {
    if (!object) {
      throw new MappingException(MappingConstants.errors.MAPPING_NULL_UNDEF_ERROR)
    }
    if (!object.path) {
      throw new MappingException(MappingConstants.errors.MAPPING_URL_TARGET_NULL_UNDEF_ERROR)
    }
    if (!object.response) {
      throw new MappingException(MappingConstants.errors.MAPPING_RESPONSE_OBJ_NULL_UNDEF_ERROR)
    }
    if (typeof object.path !== 'string') {
      throw new MappingException(MappingConstants.errors.MAPPING_PATH_NOT_STRING_ERROR)
    }
    if (typeof object.response !== 'object' || Array.isArray(object.response)) {
      throw new MappingException(MappingConstants.errors.MAPPING_RESPONSE_NOT_OBJECT_ERROR)
    }
  }
}

export default new MappingValidator()
