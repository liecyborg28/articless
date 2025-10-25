/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { PrivateGuard } from "../guards/private";
import { useAppToast } from "../providers";
import {
  Box,
  Flex,
  Tabs,
  Textarea,
  Separator,
  SkeletonText,
  Button,
  Text,
  Card,
  IconButton,
  Image,
  Heading,
  Dialog,
  Portal,
  FileUpload,
  HStack,
} from "@chakra-ui/react";
import {
  LuLogOut,
  LuPencilLine,
  LuTextSearch,
  LuTrash,
  LuUpload,
} from "react-icons/lu";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import {
  fetchHistories,
  createHistory,
  deleteHistory,
} from "@/app/store/slices/history";
import Link from "next/link";
import { extractTextClient } from "../utils/file";

export default function Dashboard() {
  const showToast = useAppToast();
  const dispatch = useDispatch<AppDispatch>();
  const { items: histories, loading } = useSelector(
    (state: RootState) => state.history
  );

  const [textSummary, setTextSummary] = useState("");
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [fileSummary, setFileSummary]: any = useState(null);

  const [textParaphrase, setTextParaphrase] = useState("");
  const [paraphrase, setParaphrase] = useState("");
  const [loadingParaphrase, setLoadingParaphrase] = useState(false);
  const [fileParaphrase, setFileParaphrase]: any = useState(null);

  async function handleGetSummary(text: string) {
    if (!text) {
      return showToast({
        title: "Error occured",
        description:
          "Please type or paste an article or link you want me to summarize",
        type: "error",
        duration: 4000,
        closable: true,
      });
    }

    const prompt = `Berikan saya rangkumannya saja tidak perlu pakai intro ala AI, dari isi link atau teks ini: ${text}. Gunakan bahasa yang sama dengan isi link atau teks.`;

    try {
      setLoadingSummary(true);
      const res: any = await axios.post("/api/ai", { prompt });
      const result = res?.data?.text;

      setSummary(result);
      setLoadingSummary(false);

      // ✅ Tambahkan ke history
      dispatch(createHistory(text)).then(() => {
        dispatch(fetchHistories());
      });
    } catch (error) {
      setLoadingSummary(false);
      showToast({
        title: "Error occured",
        description: error,
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  }

  async function handleGetParaphrase(text: string) {
    if (!text) {
      return showToast({
        title: "Error occured",
        description:
          "Please type or paste an article or link you want me to paraphrase",
        type: "error",
        duration: 4000,
        closable: true,
      });
    }

    const prompt = `Berikan saya parafrase saja tidak perlu pakai intro ala AI, dari isi link atau teks ini: ${text}. Gunakan bahasa yang sama dengan isi link atau teks.`;

    try {
      setLoadingParaphrase(true);
      const res: any = await axios.post("/api/ai", { prompt });
      const result = res?.data?.text;

      setParaphrase(result);
      setLoadingParaphrase(false);

      // ✅ Tambahkan ke history
      dispatch(createHistory(text)).then(() => {
        dispatch(fetchHistories());
      });
    } catch (error) {
      setLoadingParaphrase(false);
      showToast({
        title: "Error occured",
        description: error,
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  }

  // ✅ Fungsi hapus history
  async function handleDelete(id: string) {
    try {
      await dispatch(deleteHistory(id)).unwrap();
      dispatch(fetchHistories());
      showToast({
        title: "Deleted",
        description: "History deleted successfully",
        type: "success",
        duration: 3000,
        closable: true,
      });
    } catch (err) {
      showToast({
        title: "Error occured",
        description: err as string,
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  }

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "summary" | "paraphrase"
  ) {
    const f = e.target.files?.[0];
    console.log("test fileee", f);
    if (f) {
      if (type === "summary") {
        setFileSummary(f);
      } else {
        setFileParaphrase(f);
      }
    } else {
      return showToast({
        title: "Info",
        description: "Please select a file first.",
        type: "info",
        closable: true,
      });
    }

    const extracted = await extractTextClient(
      type === "summary" ? fileSummary : fileParaphrase
    );

    if (type === "summary") setTextSummary(extracted);

    if (type === "paraphrase") setTextParaphrase(extracted);
  }

  // ✅ Ambil history saat halaman pertama kali load
  useEffect(() => {
    dispatch(fetchHistories());
  }, [dispatch]);

  return (
    <PrivateGuard>
      <Flex
        h="100vh"
        bg="white"
        direction={{ base: "column", xl: "row", sm: "column" }}>
        <Box
          as="nav"
          color="white"
          py={3}
          px={6}
          shadow="md"
          zIndex={10}
          position="fixed"
          width="100vw"
          bg="white">
          <Flex alignItems="center" justifyContent="space-between">
            <Flex gap={5} alignItems="center">
              <Link href="/dashboard">
                <Image
                  src="/logo.png"
                  alt="Articless Logo"
                  width={50}
                  height={50}
                  filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))"
                  cursor="pointer"
                />
              </Link>
              <Heading
                as="h1"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                color="gray.800"
                lineHeight={{ base: "short", md: "shorter" }}>
                Articless
              </Heading>
            </Flex>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button variant="outline" colorPalette="pink">
                  <LuLogOut /> Logout
                </Button>
              </Dialog.Trigger>

              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title color="gray.800">
                        Confirm Logout
                      </Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body color="gray.500">
                      Are you sure you want to logout? Any unsaved changes will
                      be lost.
                    </Dialog.Body>

                    <Dialog.Footer>
                      <Dialog.ActionTrigger asChild>
                        <Button variant="outline" colorPalette="gray">
                          Cancel
                        </Button>
                      </Dialog.ActionTrigger>

                      <Button
                        onClick={() => {
                          localStorage.clear();
                          location.reload();
                        }}
                        colorPalette="pink">
                        Logout
                      </Button>
                    </Dialog.Footer>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </Flex>
        </Box>
        <Box flex="2" p={4} paddingTop={24}>
          <Tabs.Root defaultValue="summary" variant="plain">
            <Tabs.List bg="bg.muted" rounded="l3" p="1">
              <Tabs.Trigger value="summary">
                <LuTextSearch />
                Summary
              </Tabs.Trigger>
              <Tabs.Trigger value="paraphrase">
                <LuPencilLine />
                Paraphrase
              </Tabs.Trigger>
              <Tabs.Indicator rounded="l2" />
            </Tabs.List>

            <Tabs.Content value="summary">
              <Flex
                direction={{ base: "column", md: "row", sm: "column" }}
                gap={5}>
                <Flex flex={1} direction="column" gap={5}>
                  <Textarea
                    value={textSummary}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData("text");
                      setTextSummary(pastedText);
                    }}
                    onChange={(e) => setTextSummary(e.target.value)}
                    minBlockSize="45vh"
                    maxBlockSize="50vh"
                    color="gray.500"
                    placeholder="Type or paste an article or link you want me to summarize"
                  />
                  <Flex gap={5}>
                    <FileUpload.Root
                      accept={[".pdf", ".docx"]}
                      onChange={(files: any) =>
                        handleFileChange(files, "summary")
                      }>
                      <FileUpload.HiddenInput />
                      <HStack>
                        <FileUpload.Trigger asChild>
                          <Button variant="outline">
                            <LuUpload /> Upload document
                          </Button>
                        </FileUpload.Trigger>
                      </HStack>
                      <FileUpload.List />
                    </FileUpload.Root>
                    <Button
                      onClick={async () => {
                        try {
                          const clipboardText =
                            await navigator.clipboard.readText();
                          setTextSummary(clipboardText);
                        } catch (err) {
                          showToast({
                            title: "Error occured",
                            description: err,
                            type: "error",
                            closable: true,
                          });
                        }
                      }}
                      variant="outline">
                      Paste Text
                    </Button>
                    <Button
                      onClick={() => handleGetSummary(textSummary)}
                      disabled={loadingSummary}
                      loading={loadingSummary}
                      loadingText="Creating summary...">
                      Let’s Summarize
                    </Button>
                  </Flex>
                </Flex>

                <Flex flex={1} direction="column" gap={5} alignItems="flex-end">
                  {!loadingSummary && (
                    <Textarea
                      value={summary}
                      readOnly
                      minBlockSize="45vh"
                      maxBlockSize="50vh"
                      color="gray.500"
                      placeholder="Summary by AI"
                    />
                  )}
                  {loadingSummary && <SkeletonText noOfLines={8} gap="4" />}
                  {!loadingSummary && (
                    <Button
                      width="fit-content"
                      onClick={async () => {
                        if (!summary) return;
                        try {
                          await navigator.clipboard.writeText(summary);
                          showToast({
                            title: "Info",
                            description: "Text copied to clipboard!",
                            type: "info",
                            closable: true,
                          });
                        } catch (err) {
                          console.error("Failed to copy text: ", err);
                        }
                      }}
                      variant="outline">
                      Copy Text
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="paraphrase">
              <Flex
                direction={{ base: "column", md: "row", sm: "column" }}
                gap={5}>
                <Flex flex={1} direction="column" gap={5}>
                  <Textarea
                    value={textParaphrase}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData("text");
                      setTextParaphrase(pastedText);
                    }}
                    onChange={(e) => setTextParaphrase(e.target.value)}
                    minBlockSize="45vh"
                    maxBlockSize="50vh"
                    color="gray.500"
                    placeholder="Type or paste an article or link you want me to paraphrase"
                  />
                  <Flex gap={5}>
                    <FileUpload.Root
                      accept={[".pdf", ".docx"]}
                      onChange={(files: any) =>
                        handleFileChange(files, "paraphrase")
                      }>
                      <FileUpload.HiddenInput />
                      <HStack>
                        <FileUpload.Trigger asChild>
                          <Button variant="outline">
                            <LuUpload /> Upload document
                          </Button>
                        </FileUpload.Trigger>
                      </HStack>
                      <FileUpload.List />
                    </FileUpload.Root>
                    <Button
                      onClick={async () => {
                        try {
                          const clipboardText =
                            await navigator.clipboard.readText();
                          setTextParaphrase(clipboardText);
                        } catch (err) {
                          showToast({
                            title: "Error occured",
                            description: err,
                            type: "error",
                            duration: 4000,
                            closable: true,
                          });
                        }
                      }}
                      variant="outline">
                      Paste Text
                    </Button>
                    <Button
                      onClick={() => handleGetParaphrase(textParaphrase)}
                      disabled={loadingParaphrase}
                      loading={loadingParaphrase}
                      loadingText="Creating paraphrase...">
                      Let’s Paraphrase
                    </Button>
                  </Flex>
                </Flex>

                <Flex flex={1} direction="column" gap={5} alignItems="flex-end">
                  {!loadingParaphrase && (
                    <Textarea
                      value={paraphrase}
                      readOnly
                      minBlockSize="45vh"
                      maxBlockSize="50vh"
                      color="gray.500"
                      placeholder="Paraphrase by AI"
                    />
                  )}
                  {loadingParaphrase && <SkeletonText noOfLines={8} gap="4" />}
                  {!loadingParaphrase && (
                    <Button
                      width="fit-content"
                      onClick={async () => {
                        if (!paraphrase) return;
                        try {
                          await navigator.clipboard.writeText(paraphrase);
                          showToast({
                            title: "Info",
                            description: "Text copied to clipboard!",
                            type: "info",
                            closable: true,
                          });
                        } catch (err) {
                          console.error("Failed to copy text: ", err);
                        }
                      }}
                      variant="outline">
                      Copy Text
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Tabs.Content>
          </Tabs.Root>
        </Box>

        <Separator
          orientation={{
            base: "horizontal",
            md: "vertical",
            sm: "horizontal",
          }}
        />

        <Box flex="1" p={4} paddingTop={24}>
          <Flex direction="column">
            <Text color="gray.500" fontSize={22} paddingBottom={3}>
              Histories
            </Text>
            <Flex
              maxBlockSize="75vh"
              minBlockSize="75vh"
              overflow="auto"
              direction="column"
              gap={3}>
              {loading
                ? Array(4)
                    .fill(null)
                    .map((_, i) => (
                      <SkeletonText key={i} noOfLines={3} gap="3" />
                    ))
                : histories?.map((e: any) => (
                    <Card.Root width="full" key={e.id}>
                      <Card.Header alignItems="flex-end">
                        <IconButton
                          width="fit-content"
                          variant="outline"
                          colorPalette="pink"
                          aria-label="Delete"
                          onClick={() => handleDelete(e.id)}>
                          <LuTrash />
                        </IconButton>
                      </Card.Header>
                      <Card.Body gap="2">
                        <Card.Description>{e?.text}</Card.Description>
                      </Card.Body>
                      <Card.Footer justifyContent="flex-end">
                        <Button
                          onClick={() => setTextSummary(e?.text)}
                          variant="outline">
                          Add to summary
                        </Button>
                        <Button onClick={() => setTextParaphrase(e?.text)}>
                          Add to paraphrase
                        </Button>
                      </Card.Footer>
                    </Card.Root>
                  ))}
              {!loading && histories.length === 0 && (
                <Text color="gray.400" textAlign="center">
                  No histories found
                </Text>
              )}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </PrivateGuard>
  );
}
