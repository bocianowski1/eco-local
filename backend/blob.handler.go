package main

// Example using Azure Blob Storage SDK for Go
import (
	"fmt"
	"log"
	"os"

	"github.com/Azure/azure-sdk-for-go/storage"
)

func UploadProductImage(imageBytes []byte, imageKey string) error {
	accountName := os.Getenv("AZURE_STORAGE_ACCOUNT")
	accountKey := os.Getenv("AZURE_STORAGE_ACCESS_KEY")

	if accountName == "" || accountKey == "" {
		return fmt.Errorf("Azure Storage account name/key not found")
	}

	_, err := storage.NewBasicClient(accountName, accountKey)
	if err != nil {
		return err
	}

	// Create a blob service client
	// blobService := client.GetBlobService()

	log.Println("Uploading image to Azure Blob Storage...")

	// // Create a container (if not already created)
	// containerName := "product-images"
	// _, err = blobService.GetContainerReference(containerName).CreateIfNotExists(context.TODO(), nil)
	// if err != nil {
	// 	return err
	// }

	// // Upload the image to the container
	// container := blobService.GetContainerReference(containerName)
	// blob := container.GetBlobReference(imageKey)
	// err = blob.PutAppendBlob(context.TODO(), imageBytes, nil)
	// if err != nil {
	// 	return err
	// }

	return nil
}
