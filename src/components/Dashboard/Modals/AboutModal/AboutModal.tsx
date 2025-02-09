import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  createStyles,
  Divider,
  Grid,
  Group,
  HoverCard,
  Modal,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import {
  IconAnchor,
  IconBrandDiscord,
  IconBrandGithub,
  IconFile,
  IconKey,
  IconLanguage,
  IconSchema,
  IconVersions,
  IconVocabulary,
  IconWorldWww,
} from '@tabler/icons';
import { motion } from 'framer-motion';
import { InitOptions } from 'i18next';
import { i18n, Trans, useTranslation } from 'next-i18next';
import Image from 'next/image';
import { ReactNode } from 'react';
import { useConfigContext } from '../../../../config/provider';
import { useConfigStore } from '../../../../config/store';
import { useEditModeInformationStore } from '../../../../hooks/useEditModeInformation';
import { usePackageAttributesStore } from '../../../../tools/client/zustands/usePackageAttributesStore';
import { usePrimaryGradient } from '../../../layout/useGradient';
import Credits from '../../../Settings/Common/Credits';

interface AboutModalProps {
  opened: boolean;
  closeModal: () => void;
  newVersionAvailable?: string;
}

export const AboutModal = ({ opened, closeModal, newVersionAvailable }: AboutModalProps) => {
  const { classes } = useStyles();
  const colorGradiant = usePrimaryGradient();
  const informations = useInformationTableItems(newVersionAvailable);
  const { t } = useTranslation(['common', 'layout/modals/about']);

  return (
    <Modal
      onClose={() => closeModal()}
      opened={opened}
      title={
        <Group spacing="sm">
          <Image
            alt="Homarr logo"
            src="/imgs/logo/logo.png"
            width={30}
            height={30}
            style={{
              objectFit: 'contain',
            }}
          />
          <Title order={3} variant="gradient" gradient={colorGradiant}>
            {t('about')} Homarr
          </Title>
        </Group>
      }
      size="xl"
    >
      <Text mb="lg">
        <Trans i18nKey="layout/modals/about:description" />
      </Text>

      <Table mb="lg" striped highlightOnHover withBorder>
        <tbody>
          {informations.map((item, index) => (
            <tr key={index}>
              <td>
                <Group spacing="xs">
                  <ActionIcon className={classes.informationIcon} variant="default">
                    {item.icon}
                  </ActionIcon>
                  <Text>
                    <Trans
                      i18nKey={`layout/modals/about:metrics.${item.label}`}
                      components={{ b: <b /> }}
                    />
                  </Text>
                </Group>
              </td>
              <td className={classes.informationTableColumn} style={{ maxWidth: 200 }}>
                {item.content}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Divider variant="dashed" mb="md" />
      <Title order={6} mb="xs" align="center">
        {t('layout/modals/about:contact')}
      </Title>

      <Grid grow>
        <Grid.Col md={4} xs={12}>
          <Button
            component="a"
            href="https://github.com/ajnart/homarr"
            target="_blank"
            leftIcon={<IconBrandGithub size={20} />}
            variant="default"
            fullWidth
          >
            GitHub
          </Button>
        </Grid.Col>
        <Grid.Col md={4} xs={12}>
          <Button
            component="a"
            href="https://homarr.dev/"
            target="_blank"
            leftIcon={<IconWorldWww size={20} />}
            variant="default"
            fullWidth
          >
            Documentation
          </Button>
        </Grid.Col>

        <Grid.Col md={4} xs={12}>
          <Button
            component="a"
            href="https://discord.gg/aCsmEV5RgA"
            target="_blank"
            leftIcon={<IconBrandDiscord size={20} />}
            variant="default"
            fullWidth
          >
            Discord
          </Button>
        </Grid.Col>
      </Grid>
      <Credits />
    </Modal>
  );
};

interface InformationTableItem {
  icon: ReactNode;
  label: string;
  content: ReactNode;
}

interface ExtendedInitOptions extends InitOptions {
  locales: string[];
}

const useInformationTableItems = (newVersionAvailable?: string): InformationTableItem[] => {
  const colorGradiant = usePrimaryGradient();
  const { attributes } = usePackageAttributesStore();
  const { editModeEnabled } = useEditModeInformationStore();

  const { configVersion } = useConfigContext();
  const { configs } = useConfigStore();

  let items: InformationTableItem[] = [];

  if (editModeEnabled) {
    items = [
      ...items,
      {
        icon: <IconKey size={20} />,
        label: 'experimental_disableEditMode',
        content: (
          <Stack>
            <Badge color="red">WARNING</Badge>
            <Text color="red" size="xs">
              This is an experimental feature, where the edit mode is disabled entirely - no config
              modifications are possbile anymore. All update requests for the config will be dropped
              on the API. This will be removed in future versions, as Homarr will receive a proper
              authentication system, which will make this obsolete.
            </Text>
          </Stack>
        ),
      },
    ];
  }

  if (i18n !== null) {
    const usedI18nNamespaces = i18n.reportNamespaces.getUsedNamespaces();
    const initOptions = i18n.options as ExtendedInitOptions;

    items = [
      ...items,
      {
        icon: <IconLanguage size={20} />,
        label: 'i18n',
        content: (
          <Badge variant="gradient" gradient={colorGradiant}>
            {usedI18nNamespaces.length}
          </Badge>
        ),
      },
      {
        icon: <IconVocabulary size={20} />,
        label: 'locales',
        content: (
          <Badge variant="gradient" gradient={colorGradiant}>
            {initOptions.locales.length}
          </Badge>
        ),
      },
    ];
  }

  items = [
    {
      icon: <IconSchema size={20} />,
      label: 'configurationSchemaVersion',
      content: (
        <Badge variant="gradient" gradient={colorGradiant}>
          {configVersion}
        </Badge>
      ),
    },
    {
      icon: <IconFile size={20} />,
      label: 'configurationsCount',
      content: (
        <Badge variant="gradient" gradient={colorGradiant}>
          {configs.length}
        </Badge>
      ),
    },
    {
      icon: <IconVersions size={20} />,
      label: 'version',
      content: (
        <Group position="right">
          <Badge variant="gradient" gradient={colorGradiant}>
            {attributes.packageVersion ?? 'Unknown'}
          </Badge>
          {newVersionAvailable && (
            <HoverCard shadow="md" position="top" withArrow>
              <HoverCard.Target>
                <motion.div
                  initial={{ scale: 1.2 }}
                  animate={{
                    scale: [0.8, 1.1, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                  <Badge color="green" variant="filled">
                    new: {newVersionAvailable}
                  </Badge>
                </motion.div>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                Version{' '}
                <b>
                  <Anchor
                    target="_blank"
                    href={`https://github.com/ajnart/homarr/releases/tag/${newVersionAvailable}`}
                  >
                    {newVersionAvailable}
                  </Anchor>
                </b>{' '}
                is available ! Current version: {attributes.packageVersion}
              </HoverCard.Dropdown>
            </HoverCard>
          )}
        </Group>
      ),
    },
    {
      icon: <IconAnchor size={20} />,
      label: 'nodeEnvironment',
      content: (
        <Badge variant="gradient" gradient={colorGradiant}>
          {attributes.environment}
        </Badge>
      ),
    },
    ...items,
  ];

  return items;
};

const useStyles = createStyles(() => ({
  informationTableColumn: {
    textAlign: 'right',
  },
  informationIcon: {
    cursor: 'default',
  },
}));
