const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withMapsFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.projectRoot, 'ios', 'Podfile');
      let podfileContent = fs.readFileSync(podfilePath, 'utf8');

      const mapsFixCode = `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
        config.build_settings['DEFINES_MODULE'] = 'YES'
      end
      
      # Google Maps 관련 에러 해결을 위한 추가 설정
      if target.name == 'react-native-google-maps' || target.name == 'react-native-maps'
        target.build_configurations.each do |config|
          # 프레임워크 내에서 헤더 검색 경로 강화
          config.build_settings['OTHER_CPLUSPLUSFLAGS'] = (config.build_settings['OTHER_CPLUSPLUSFLAGS'] || '$(inherited)') + ' "-fcxx-modules"'
        end
      end
    end`;

      if (podfileContent.includes('post_install do |installer|')) {
        if (!podfileContent.includes('CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES')) {
          podfileContent = podfileContent.replace(
            'post_install do |installer|',
            `post_install do |installer|${mapsFixCode}`
          );
        }
      } else {
        podfileContent += `
post_install do |installer|${mapsFixCode}
end
`;
      }

      fs.writeFileSync(podfilePath, podfileContent);
      return config;
    },
  ]);
};

module.exports = withMapsFix;
