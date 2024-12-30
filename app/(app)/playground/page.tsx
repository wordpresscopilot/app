import { PlaygroundComponent } from "@/components/playground/playground";

export default async function PlaygroundPage() {
  const blueprint = {
    steps: [
      { step: "login" },
      {
        step: "defineWpConfigConsts",
        consts: {
          WP_DISABLE_FATAL_ERROR_HANDLER: true,
          WP_DEBUG: true,
          WP_DEBUG_DISPLAY: true,
        },
      },
      {
        step: "installTheme",
        themeZipFile: {
          resource: "wordpress.org/themes",
          slug: "astra",
        },
      },
      // {
      //   step: "installPlugin",
      //   pluginZipFile: {
      //     resource: "wordpress.org/plugins",
      //     slug: "interactive-code-block",
      //   },
      // },
      // {
      //   step: "runPHP",
      //   code: "<?php require '/wordpress/wp-load.php'; wp_insert_post(['post_title' => 'WordPress Playground block demo!','post_content' => '<!-- wp:wordpress-playground/playground /-->', 'post_status' => 'publish', 'post_type' => 'post',]);",
      // },
    ],
  };

  return (
    // <CustomExternalStoreRuntimeProvider site={site}>
    //   <SiteHeader site={site} />
    //   <AssistantUI />
    // </CustomExternalStoreRuntimeProvider>
    <PlaygroundComponent blueprint={blueprint} />
  );
}
