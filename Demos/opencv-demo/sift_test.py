#coding=utf-8
import cv2
import time
import numpy as np
import math


import math
import scipy.linalg as linalg
import matplotlib as mpl
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt

from scipy.spatial.transform import Rotation as R


#这里使用的Python 3
def sift_kp(image):
    gray_image = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
    sift = cv2.xfeatures2d.SIFT_create()
    kp,des = sift.detectAndCompute(image,None)
    kp_image = cv2.drawKeypoints(gray_image,kp,None)
    return kp_image,kp,des

def get_good_match(des1,des2):
    bf = cv2.BFMatcher()
    matches = bf.knnMatch(des1, des2, k=2)
    good = []
    for m, n in matches:
        if m.distance < 0.75 * n.distance:
            good.append(m)
    return good

def isRotationMatrix(R) :
    Rt = np.transpose(R)
    shouldBeIdentity = np.dot(Rt, R)
    I = np.identity(3, dtype = R.dtype)
    n = np.linalg.norm(I - shouldBeIdentity)
    return n < 1e-6



def siftImageAlignment(img1,img2, isfh=True):
   _,kp1,des1 = sift_kp(img1)
   _,kp2,des2 = sift_kp(img2)
   goodMatch = get_good_match(des1,des2)
   if len(goodMatch) > 4:
        ptsA= np.float32([kp1[m.queryIdx].pt for m in goodMatch]).reshape(-1, 1, 2)
        ptsB = np.float32([kp2[m.trainIdx].pt for m in goodMatch]).reshape(-1, 1, 2)
        ransacReprojThreshold = 4

        if isfh == True :

            # 单应映射
            H, status =cv2.findHomography(ptsA,ptsB,cv2.RANSAC,ransacReprojThreshold);
            print("is rotation matrix ")
            print( isRotationMatrix( H ) )

            x = [99, 221, 1] # 全景图中心点
            x1 = np.dot(H,x)
            print( x1.tolist() )
            print([x[i] - x1[i] for i in range(3)]) # 变换矩阵 三个轴位移的量

            imgOut = cv2.warpPerspective(img2, H, (img1.shape[1],img1.shape[0]),flags=cv2.INTER_LINEAR + cv2.WARP_INVERSE_MAP)
        else:

            # 仿射映射
            transformation_rigid_matrix, rigid_mask = cv2.estimateAffinePartial2D(ptsA, ptsB)

            x = [99, 221, 1] # 全景图中心点
            x1 = np.dot(transformation_rigid_matrix,x)
            print( x1 )

            imgOut = cv2.warpAffine(img2, transformation_rigid_matrix , (img1.shape[1],img1.shape[0]))

        # r = R.from_quat([0, 0, np.sin(np.pi/4), np.cos(np.pi/4)])
        # print( H.tolist() )

        return imgOut #,H,status

def main():
    img1 = cv2.imread('/Users/apple/Downloads/r_normal2.jpg')
    img2 = cv2.imread('/Users/apple/Downloads/r_mix2.jpg')

    # result = siftImageAlignment(img2,img1,False)
    newresult = siftImageAlignment(img1,img2,False)
    # newresult = siftImageAlignment(result, img1,False)


    ts = time.time()
    filename = '{:f}.jpg'.format(ts)
    cv2.imwrite(filename, newresult)

    '''
    allImg = np.concatenate((img1,img2,result),axis=1)
    cv2.namedWindow('Result',cv2.WINDOW_NORMAL)
    cv2.imshow('Result',allImg)
    cv2.waitKey(0)
    '''

if __name__ == "__main__":
    main()
    # calculate_new_center_point()
