"use client";
import { Artifact } from "@/types/export-pipeline";
import { PlaygroundComponent } from "./playground";

export const PlaygroundArtifact = ({ artifact }: { artifact: Artifact }) => {
  let item = artifact.content?.[0];
  item = typeof item === "string" ? JSON.parse(item) : item;
  console.log("item", item);
  const defaultBlueprint = {
    steps: [
      {
        step: "login",
      },
      // {
      //   step: "installPlugin",
      //   pluginData: {
      //     resource: "wordpress.org/plugins",
      //     slug: "gutenberg",
      //   },
      //   options: {
      //     activate: true,
      //   },
      // },
      {
        step: "installTheme",
        themeZipFile: {
          resource: "wordpress.org/themes",
          slug: "astra",
        },
        options: {
          activate: true,
        },
      },
      {
        step: "defineWpConfigConsts",
        consts: {
          WP_DISABLE_FATAL_ERROR_HANDLER: true,
          WP_DEBUG: true,
          WP_DEBUG_DISPLAY: true,
        },
      },
      {
        step: "runPHP",
        code: "<?php require '/wordpress/wp-load.php'; wp_insert_post(['post_title' => 'WordPress Playground block demo!','post_content' => '<!-- wp:wordpress-playground/playground /-->', 'post_status' => 'publish', 'post_type' => 'post',]);",
      },
      ...(item?.plugin_name
        ? [
            {
              step: "mkdir",
              path: `/wordpress/wp-content/plugins/${item.plugin_name}`,
            },
            {
              step: "writeFile",
              path: `/wordpress/wp-content/plugins/${item.plugin_name}/${item.plugin_name}.php`,
              data: `${item.plugin_file_content}`,
            },
            {
              step: "activatePlugin",
              pluginPath: `${item.plugin_name}/${item.plugin_name}.php`,
            },
          ]
        : []),
      // {
      //   step: "runPHP",
      //   code: `
      //     $page = get_page_by_path('${item?.page_path}');
      //     if ($page) {
      //       update_option('page_on_front', $page->ID);
      //       update_option('show_on_front', 'page');
      //     }
      //   `,
      // },
    ],
    // setup: async (wp) => {
    //   const createdPage = await wp.data
    //     .select("core")
    //     .getEntityRecords("postType", "page", {
    //       per_page: 1,
    //       orderby: "date",
    //       order: "desc",
    //     });
    // },
    features: {
      networking: true,
    },
    siteOptions: {
      blogname: "wpc.dev Playground",
    },
    // landingPage: item?.page_path,
    // {
    // 	"step": "installTheme",
    // 	"themeZipFile": {
    // 		"resource": "wordpress.org/themes",
    // 		"slug": "twentytwentyfour"
    // 	},
    // 	"options": {
    // 		"activate": true
    // 	}
    // }
  };

  return <PlaygroundComponent blueprint={defaultBlueprint} />;
};
