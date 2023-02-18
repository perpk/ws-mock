import CacheManager from './CacheManager'
import MappingConstants from '../domain/mapping/MappingConstants'
import Mapping from '../domain/mapping/Mapping'
import MappingException from '../domain/mapping/MappingException'

const { errors: mappingErrors } = MappingConstants

describe('A Mapping is passed to the CacheManager', () => {
  describe('Successful entry creation', () => {
    test('If a legit Mapping is successfully cached', () => {
      const mapping: Mapping = {
        path: 'test',
        response: {
          first: 'then done'
        }
      }

      CacheManager.createEntry(mapping)

      expect(CacheManager.getEntry(mapping.path)).toEqual(mapping.response)
    })
    test('If a nested object can be cached', () => {
      const mapping: Mapping = {
        path: 'nested',
        response: {
          levelOne: {
            levelTwo: {
              levelThree: {
                theDeepEnd: 'here'
              }
            }
          }
        }
      }
      CacheManager.createEntry(mapping)
      expect(CacheManager.getEntry(mapping.path)).toEqual(mapping.response)
    })
  })

  describe('Unsucessful entry creation', () => {
    let errorScenarios: any[]

    beforeAll(() => {
      errorScenarios = []
    })

    test('Throw an error if null is passed for mapping', () => {
      const nullMapping = () => CacheManager.createEntry(null)
      expect(nullMapping).toThrow(MappingException)
    })

    test.each`
      path         | response                 | errorMessage
      ${null}      | ${(test['one'] = 'two')} | ${mappingErrors.MAPPING_NULL_UNDEF_ERROR}
      ${undefined}  | ${(test['one'] = 'two')} | ${mappingErrors.MAPPING_URL_TARGET_NULL_UNDEF_ERROR}
      ${1}         | ${(test['one'] = 'two')} | ${mappingErrors.MAPPING_PATH_NOT_STRING_ERROR}
      ${[2, 3]}    | ${(test['one'] = 'two')} | ${mappingErrors.MAPPING_PATH_NOT_STRING_ERROR}
      ${'1'}       | ${null}                  | ${mappingErrors.MAPPING_RESPONSE_OBJ_NULL_UNDEF_ERROR}
      ${'1'}       | ${undefined}              | ${mappingErrors.MAPPING_RESPONSE_OBJ_NULL_UNDEF_ERROR}
      ${'1'}       | ${[]}                    | ${mappingErrors.MAPPING_RESPONSE_NOT_OBJECT_ERROR}
      ${'1'}       | ${1}                     | ${mappingErrors.MAPPING_RESPONSE_NOT_OBJECT_ERROR}
    `(
      "Mapping with path '$path' response '$response' should throw error '$errorMessage'",
      ({ path, response, errorMessage }) => {
        const faulty = () => CacheManager.createEntry({ path, response })
        expect(faulty).toThrow(errorMessage)
      }
    )
  })
})
